import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

import { user } from "@/db/schema/user";
import { account } from "@/db/schema/account";
import { session } from "@/db/schema/session";
import { verification } from "@/db/schema/verification";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { polarClient } from "./polar";


export const auth = betterAuth({
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true,
                }),
                portal(),
            ],
        }),
    ],
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
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