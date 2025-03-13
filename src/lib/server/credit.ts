"use server"

import { db } from "../db";

export async function getUserCredit(userId: string) {
    return db.user.findUnique({
      where: { id: userId },
      select: { credit: true },
    });
  }
  
  export async function getCreditHistory(userId: string) {
    return db.creditHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }