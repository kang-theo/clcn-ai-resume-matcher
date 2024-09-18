import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "@auth/core/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

import { z } from "zod";

const loginUserSchema = z.object({
  username: z.string().regex(/^[a-z0-9_-]{3,15}$/g, "Invalid username"),
  password: z.string().min(5, "Password should be minimum 5 characters"),
});

export const authOptions = {
  // Define the secret
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        username: { type: "text", placeholder: "Please input your username" },
        password: {
          type: "password",
          placeholder: "Please input your password",
        },
      },
      // async authorize(credentials, req) {
      async authorize(credentials) {
        const { username, password } = loginUserSchema.parse(credentials);
        // next-auth.ja signIn with prisma
        const user = await prisma.user.findUnique({
          where: { username },
        });
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async authorized({ request, auth }) {
      return !!auth?.user;
      // return auth?.user?.isAdmin === true; // Only admin user can be authorized
      // return true;
    },
    // authorized: async ({ request: NextRequest, auth: Session | null}) => {
    //   return true;
    // }
    // async signIn({ user, account, profile, email, credentials }) {
    //   return true
    // },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl
    // },
    // async session({ session, user, token }) {
    //   return session
    // },
    // async jwt({ token, user, account, profile, isNewUser }) {
    //   return token
    // }
  },
  pages: {
    signIn: "/auth/sign-in",
    // signOut: '/auth/sign-out',
    error: "/auth/error", // Error code passed in query string as ?error=????
    // error: "/auth/error", // Error code passed in query string as ?error=????
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user'              // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};

// auth.js library
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions);
