import bcrypt from "bcrypt";;
import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, newPassword } = body;

        if (!userId || !newPassword) {
            return NextResponse.json({ message: "Missing userId or newPassword" }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
        }

        const user = await db.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Error changing password:", error);
        return NextResponse.json({ message: "Could not update password" }, { status: 404 });
    }
}