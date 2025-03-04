// import NextAuth from "next-auth";

// declare module "next-auth" {
//   interface User {
//     id: string;
//     email: string;
//     username: string;
//     role: string;
//     credit: number;
//     subscription?: {
//       planId: string;
//       planName: string;
//       status: string;
//       startDate: string;
//       endDate: string | null;
//     } | null;
//   }

//   interface Session {
//     user: User;
//   }

//   interface JWT {
//     id: string;
//     username: string;
//     role: string;
//     credit: number;
//     subscription?: {
//       planId: string;
//       planName: string;
//       status: string;
//       startDate: string;
//       endDate: string | null;
//     } | null;
//   }
// }

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    email: string;
    username: string;
    role: string;
    credit: number;
    subscription?: {
      planId: string;
      planName: string;
      status: string;
      startDate: string;
      endDate: string | null;
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
    subscription?: {
      planId: string;
      planName: string;
      status: string;
      startDate: string;
      endDate: string | null;
    } | null;
  }
}
