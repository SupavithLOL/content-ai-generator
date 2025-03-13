"use server"

import { db } from "../db";

export async function getBillHistory(userId: string){
    return await db.billingHistory.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
}