import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { listingFormSchema } from "~/lib/validators/listingFormSchema"
import { z } from "zod"

export const listingRouter = createTRPCRouter({
  // ✅ Create Listing (no images yet)
  create: protectedProcedure
    .input(listingFormSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id
      if (!userId) throw new Error("User ID not found")

      const listing = await ctx.db.listing.create({
        data: {
          ...input,
          ownerId: userId,
          images: [], // initialize as empty; will be updated later
        },
        select: {
          id: true, // 👈 Return only ID
        },
      })

      return listing
    }),

  // ✅ Update listing with image URLs
  updateImages: protectedProcedure
    .input(
      z.object({
        listingId: z.string(),
        urls: z.array(z.string().url()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.listing.update({
        where: { id: input.listingId },
        data: {
          images: input.urls,
        },
      })
    }),
})
