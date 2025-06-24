import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "~/server/api/routers/auth";
import type { createTRPCContext } from "~/server/api/trpc"; // ✅ Correct usage
import { listingRouter } from "~/app/api/routers/listing";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  listing: listingRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = (
  context: Awaited<ReturnType<typeof createTRPCContext>>
) => appRouter.createCaller(context);
