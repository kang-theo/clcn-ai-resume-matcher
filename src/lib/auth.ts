import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "@auth/core/providers/credentials";
import { loginUserSchema } from "./schema";
import { authenticateUser } from "@/models/user";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { type: "text", placeholder: "Please input your email" },
        password: {
          type: "password",
          placeholder: "Please input your password",
        },
      },
      // async authorize(credentials, req) {
      async authorize(credentials) {
        try {
          console.log({ credentials });
          const validation = loginUserSchema.safeParse(credentials);
          if (!validation.success) {
            throw new Error("Invalid credentials");
          }

          // const { email, password } = loginUserSchema.parse(credentials);
          const user = await authenticateUser(credentials as any);

          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user;
          } else {
            // If you return null or false then the credentials will be rejected
            return null;
          }
        } catch (err) {
          // TODO
          // Log to monitor platform
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // httpOptions: {
      //   timeout: 40000,
      // },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    // async redirect({ baseUrl }) {
    //   return baseUrl;
    // },
    // parameters: { request, auth }
    // async authorized({ auth }) {
    //   return !!auth?.user;
    //   // return true;
    // },
    // authorized: async ({ request: NextRequest, auth: Session | null}) => {
    //   return true;
    // }
    // { user, account, profile, email, credentials }
    async signIn({ user }) {
      // Add user info to the session
      if (user) {
        return true;
      } else {
        return false;
      }
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any) = {
          id: token.id,
          username: token.username,
          email: token.email,
          linkedin: token.youtube_link,
          image: token.image,
        };
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      // Add user info to the token object
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.linkedin = user.linkedin;
        token.image = user.image;
        token.roles = user.roles;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    // signOut: '/auth/signout',
    error: "/auth/error", // Error code passed in query string as ?error=????
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user'              // New users will be directed here on first sign in (leave the property out if not of interest)
  },
});
