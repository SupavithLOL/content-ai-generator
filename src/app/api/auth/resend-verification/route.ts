import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        // ค้นหาผู้ใช้ในฐานข้อมูล
        const user = await db.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // ถ้าผู้ใช้ยืนยันอีเมลแล้ว ไม่ต้องส่งใหม่
        if (user.emailVerified) {
            return NextResponse.json({ message: "Email already verified" }, { status: 400 });
        }

        // ลบโทเค็นเก่าถ้ามี
        await db.verificationToken.deleteMany({
            where: { email: email },
        });

        // สร้างโทเค็นใหม่
        const verificationToken = await generateVerificationToken(email);

        // ส่งอีเมลยืนยันใหม่
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return NextResponse.json({ message: "Verification email has been resent" }, { status: 200 });

    } catch (error) {
        console.error("Error resending verification email:", error);
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
}
