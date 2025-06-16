import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "~/server/api/routers/auth";
import type { createTRPCContext } from "~/server/api/trpc"; // ✅ Correct usage

export const appRouter = createTRPCRouter({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = (
  context: Awaited<ReturnType<typeof createTRPCContext>>
) => appRouter.createCaller(context);
