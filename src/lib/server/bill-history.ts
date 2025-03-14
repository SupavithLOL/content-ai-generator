"use server"

import { db } from "../db";

export const getBillHistory = async (userId: string) => {
    return await db.billingHistory.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
};