// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticateUser } from "@/lib/odoo";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Call our Odoo authentication function
                const user = await authenticateUser(credentials.email, credentials.password);

                if (user) {
                    // Return the user object to be saved in the session token
                    return { id: user.id.toString(), name: user.name, email: user.email };
                } else {
                    // Return null if user not found or password doesn't match
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/login', // We will create this page next
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        // Add user ID to the session object
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as { id?: string }).id = token.sub;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };