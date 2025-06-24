"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { listingFormSchema } from "~/lib/validators/listingFormSchema"
import { Form } from "~/components/ui/form"
import { ListingFormFields } from "./ListingFormFields"
import { api } from "~/trpc/react"
import { toast } from "sonner"
import { useState } from "react"
import { uploadImagesToSupabase } from "~/lib/uploadImages"

type FormData = z.infer<typeof listingFormSchema>

export function ListingForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subcategory: "",
      roomType: "",
      genderAllowed: "All",
      price: null,
      isFree: false,
      amenities: [],
      locality: "",
      city: "",
      district: "",
      state: "",
      availableFrom: undefined,
    },
  })

  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const createListing = api.listing.create.useMutation({
    onSuccess: async (listing) => {
      // After creating listing, upload images and update
      if (files.length > 0) {
        try {
          const imageUrls = await uploadImagesToSupabase(files, listing.id)
          
          if (imageUrls.length > 0) {
            // Update listing with image URLs
            await updateListingImages.mutateAsync({
              listingId: listing.id,
              urls: imageUrls
            })
            toast.success("Listing created and images uploaded successfully!")
          } else {
            toast.warning("Listing created but image upload failed")
          }
        } catch (error) {
          console.error("Image upload error:", error)
          toast.warning("Listing created but image upload failed")
        }
      } else {
        toast.success("Listing created successfully!")
      }
      
      form.reset()
      setFiles([])
      setIsUploading(false)
    },
    onError: (error) => {
      console.error("Failed to create listing:", error)
      toast.error("Failed to create listing")
      setIsUploading(false)
    },
  })

  const updateListingImages = api.listing.updateImages.useMutation({
    onError: (error) => {
      console.error("Failed to update images:", error)
      toast.error("Failed to save images")
    }
  })

  const onSubmit = async (data: FormData) => {
    if (files.length === 0) {
      toast.error("Please upload at least one image")
      return
    }

    setIsUploading(true)
    
    // Create listing first (without images)
    createListing.mutate(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("Form validation errors:", errors)
          toast.error("Please fix the validation errors")
        })}
        className="space-y-4"
      >
        <ListingFormFields form={form} files={files} setFiles={setFiles} />
        <button
          type="submit"
          disabled={createListing.isPending || updateListingImages.isPending || isUploading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {isUploading ? "Uploading images..." : 
           createListing.isPending ? "Creating listing..." : 
           updateListingImages.isPending ? "Saving images..." : 
           "Submit"}
        </button>
      </form>
    </Form>
  )
}