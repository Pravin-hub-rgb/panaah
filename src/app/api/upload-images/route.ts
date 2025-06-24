// src/app/api/upload-images/route.ts
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { auth } from "~/server/auth"
import { createClient } from "@supabase/supabase-js"

// Use service role key for server-side operations (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Add this to your .env
)

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated with NextAuth v5
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const listingId = formData.get("listingId") as string

    if (!listingId) {
      return NextResponse.json({ error: "Listing ID required" }, { status: 400 })
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      const filePath = `${listingId}/${crypto.randomUUID()}-${file.name}`
      
      // Convert File to Buffer for server-side upload
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const { error } = await supabaseAdmin.storage
        .from("listing-images")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false
        })

      if (error) {
        console.error("Upload error:", error)
        continue
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("listing-images")
        .getPublicUrl(filePath)

      uploadedUrls.push(publicUrlData.publicUrl)
    }

    return NextResponse.json({ urls: uploadedUrls })
  } catch (error) {
    console.error("API upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}