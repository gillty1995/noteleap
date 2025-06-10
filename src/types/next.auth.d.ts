import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      /** The Auth.js user id. */
      id: string;
    } & DefaultSession["user"];
  }
}