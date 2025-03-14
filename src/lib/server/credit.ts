"use server"

import { db } from "../db";
import { cache } from 'react'

  export const getUserCredit = cache(async (userId: string) => {
    return db.user.findUnique({
      where: { id: userId },
      select: { credit: true },
    });
  });

  export const getCreditHistory = cache(async (userId: string) => {
    return db.creditHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  });
