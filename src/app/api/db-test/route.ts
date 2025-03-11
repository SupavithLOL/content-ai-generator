// src/app/api/db-test/route.ts  (แก้ไขแล้ว - App Router)
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) { // เปลี่ยนเป็น export async function GET(req: Request)
    console.log(`API Route: /api/db-test - Request Method: ${req.method}`);

  try {
    console.log("API Route: /api/db-test - Starting database connection test...");

    console.log("Attempting database connection using db.$connect()...");
    await db.$connect();
    console.log("Database connection successful!");

    console.log("Attempting to fetch users from database using db.user.count()...");
    const userCount = await db.user.count();
    console.log(`Successfully fetched user count: ${userCount}`);
    await db.$disconnect();

    console.log("API Route: /api/db-test - Database test completed successfully.");

    return NextResponse.json({ success: true, message: 'Database connection and query successful!', userCount });

  } catch (error: unknown) {
    console.error("API Route: /api/db-test - Database connection or query error occurred!");
    console.error("Error Object:", error);
    console.error("Error Message:", (error as Error).message);
    console.error("Error Stack Trace:", (error as Error).stack);

    await db.$disconnect();

    return NextResponse.json({ success: false, message: 'Database connection or query failed!', error: (error as Error).message, fullError: error });
  }
}