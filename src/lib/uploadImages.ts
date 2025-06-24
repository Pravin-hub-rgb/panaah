// src/lib/uploadImages.ts

// Define the expected response type from your API
interface UploadResponse {
  urls: string[];
  error?: string;
}

export async function uploadImagesToSupabase(
  files: File[],
  listingId: string
): Promise<string[]> {
  try {
    const formData = new FormData()
    files.forEach(file => {
      formData.append("files", file)
    })
    formData.append("listingId", listingId)
    
    const response = await fetch("/api/upload-images", {
      method: "POST",
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }
    
    const result = await response.json() as UploadResponse
    return result.urls ?? []
  } catch (error) {
    console.error("Upload failed:", error)
    return []
  }
}