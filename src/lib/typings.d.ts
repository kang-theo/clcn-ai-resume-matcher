import NextAuth from "next-auth";
import { DefaultUser } from "next-auth";

declare namespace API {
  interface AxiosError extends Error {
    config: AxiosRequestConfig;
    code?: string;
    response?: AxiosResponse;
    request?: any;
    stack?: string;
  }

  // define types from here...
}

// Extend the `User` type from `next-auth` to include custom properties
declare module "next-auth" {
  interface User extends DefaultUser {
    username?: string;
  }

  interface Session {
    user: User & {
      username?: string; // Custom property
    };
  }
}
