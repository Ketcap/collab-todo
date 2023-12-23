import NextAuth, { Session as OriginalSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface User extends OriginalSession["user"] {
    id: string;
  }
  interface Session {
    user: User;
  }
}
