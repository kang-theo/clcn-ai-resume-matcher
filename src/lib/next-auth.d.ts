import NextAuth from "next-auth";
import { DefaultSession, User as DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    username: string;
  }
  interface Session {
    user: User & DefaultSession["user"];
  }
  interface JWT {
    id: string;
    name: string;
    email: string;
    username: string;
    image?: string;
  }
}
