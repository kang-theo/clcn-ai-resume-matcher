import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const authOptions = {
  // Define the secret
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
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
