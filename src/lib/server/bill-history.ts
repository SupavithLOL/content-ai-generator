"use server"

import { db } from "../db";
import { cache } from 'react'

export const getBillHistory = cache(async (userId: string) => {
    return await db.billingHistory.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
});