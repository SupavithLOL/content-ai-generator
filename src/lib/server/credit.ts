"use server"

import { db } from "../db";

  export const getUserCredit = async (userId: string) => {
    return db.user.findUnique({
      where: { id: userId },
      select: { credit: true },
    });
  };

  export const getCreditHistory = async (userId: string) => {
    return db.creditHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  };
