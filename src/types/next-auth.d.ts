import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    username: string;
    role: "USER" | "ADMIN";
    credit: number;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id: string;
    username: string;
    role: "USER" | "ADMIN";
    credit: number;
  }
}
