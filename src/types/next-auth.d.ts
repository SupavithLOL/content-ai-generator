import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    email: string;
    username: string;
    role: string;
    credit: number;
    createdAt: Date;
    subscription?: {
      planId: string;
      planName: string;
      status: string;
      startDate: Date;
      endDate?: Date;
    } | null;
  }

  interface Session extends DefaultSession {
    user: User;
  }

  interface JWT {
    id: string;
    username: string;
    role: string;
    credit: number;
    createdAt: Date;
    subscription?: {
      planId: string;
      planName: string;
      status: string;
      startDate: Date;
      endDate?: Date;
    } | null;
  }
}
