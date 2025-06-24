'use client'
import { useSession } from "next-auth/react"
import { ListingForm } from "~/components/listing/ListingForm"

export default function CreateListingPage() {
  const { data: session, status } = useSession()

  if (status === "loading") return null

  if (!session) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold">You must be signed in to create a listing.</h2>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create a New Listing</h1>
      <ListingForm />
    </div>
  )
}
