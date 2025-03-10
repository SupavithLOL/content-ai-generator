import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    email: string;
    username: string;
    role: string;
    createdAt: string;
  }

  interface Session extends DefaultSession {
    user: User;
  }

  interface JWT {
    id: string;
    username: string;
    role: string;
    createdAt: string;
  }
}
