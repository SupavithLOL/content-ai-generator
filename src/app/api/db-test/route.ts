// pages/api/db-test.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db'; // **สำคัญ:** แก้ path ให้ถูกต้องตามตำแหน่งไฟล์ `db.ts` ของคุณ

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("API Route: /api/db-test - Request Headers:", req.headers);
  try {
    console.log("API Route: /api/db-test - Starting database connection test..."); // Log จุดเริ่มต้น

    console.log("Attempting database connection using db.$connect()...");
    await db.$connect();
    console.log("Database connection successful!");

    console.log("Attempting to fetch users from database using db.user.count()...");
    const userCount = await db.user.count();
    console.log(`Successfully fetched user count: ${userCount}`);
    await db.$disconnect();

    console.log("API Route: /api/db-test - Database test completed successfully."); // Log จุดสำเร็จ

    res.status(200).json({ success: true, message: 'Database connection and query successful!', userCount });

  } catch (error: unknown) { // ใช้ 'any' type สำหรับ error เพื่อความยืดหยุ่น
    console.error("API Route: /api/db-test - Database connection or query error occurred!"); // Log จุด Error
    console.error("Error Object:", error); // Log Error Object ทั้งหมด
    console.error("Error Message:", (error as Error).message); // Log Error Message
    console.error("Error Stack Trace:", (error as Error).stack); // Log Stack Trace

    await db.$disconnect(); // Ensure disconnect even on error

    res.status(500).json({ success: false, message: 'Database connection or query failed!', error: (error as Error).message, fullError: error });
  }
}