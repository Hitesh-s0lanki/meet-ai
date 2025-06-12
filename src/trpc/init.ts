import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';
import { meetings } from '@/db/schema/meetings';
import { count, eq } from "drizzle-orm";
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from '@/constants';
import { agents } from '@/db/schema/agent';
import { db } from '@/db';

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
});

const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
  }

  return next({ ctx: { ...ctx, auth: session } });
});

export const premiumProcedure = (entity: "agents" | "meetings") =>
  protectedProcedure.use(async ({ ctx, next }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });

    if (!customer) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a customer.",
      });
    }

    const [userMeetings] = await db
      .select({
        count: count(meetings.id),
      })
      .from(meetings)
      .where(eq(meetings.userId, ctx.auth.user.id));

    const [userAgents] = await db
      .select({
        count: count(agents.id),
      })
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id));

    const isPremium = customer.activeSubscriptions.length > 0;
    const hasFreeAgentLimitReached = userAgents.count >= MAX_FREE_AGENTS;
    const hasFreeMeetingLimitReached = userMeetings.count >= MAX_FREE_MEETINGS;

    const shouldThrowMeetingError =
      entity === "meetings" && hasFreeMeetingLimitReached && !isPremium;
    const shouldThrowAgentError =
      entity === "agents" && hasFreeAgentLimitReached && !isPremium;

    if (shouldThrowMeetingError) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reached the maximum number of free meetings.",
      });
    }

    if (shouldThrowAgentError) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reached the maximum number of free agents.",
      });
    }

    return next({ ctx: { ...ctx, customer } });
  });