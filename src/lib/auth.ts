import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

import { user } from "@/db/schema/user";
import { account } from "@/db/schema/account";
import { session } from "@/db/schema/session";
import { verification } from "@/db/schema/verification";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user,
            account,
            session,
            verification
        }
    }),
    emailAndPassword: {
        enabled: true
    },
});