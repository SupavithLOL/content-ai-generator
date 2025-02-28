import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { getUserByEmail } from "@/data/user";

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { error: "TokenDoesNotExist" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "TokenExpired" };
    }

    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
        return { error: "EmailNotFound" };
    }

    await db.user.update({
        where: {id: existingUser.id},
        data:{
            emailVerified: new Date(),
            email: existingToken.email //เพื่อที่จะมีการ update email เราเลยจะต้องส่ง token กับ email ใหม่
        },
    });
    await db.verificationToken.delete({
        where: { id: existingToken.id },
    });

    return { success: "Email verified successfully" };
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({ message: "Missing token!" }, { status: 400 });
        }

        const verificationResult = await newVerification(token);

        if (verificationResult.error) {
            // ตรวจสอบให้แน่ใจว่า error ทุกกรณี return JSON responses
            if (verificationResult.error === "TokenDoesNotExist") {
                return NextResponse.json({ message: "Token does not exist", error: "TokenDoesNotExist" }, { status: 404 });
            }
            if (verificationResult.error === "TokenExpired") {
                return NextResponse.json({ message: "Token Expired", error: "TokenExpired" }, { status: 400 });
            }
            if (verificationResult.error === "EmailNotFound") {
                return NextResponse.json({ message: "Email Not Found", error: "EmailNotFound" }, { status: 404 });
            }
            // Generic error case - ยังคง return JSON
            return NextResponse.json({ message: "Verification failed", error: "VerificationFailed" }, { status: 400 });
        }

        return NextResponse.json(
            { message: "Verication Success", success: true }, // เพิ่ม success: true สำหรับตรวจสอบฝั่ง client
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in new-verification route:", error);
        return NextResponse.json({ message: "Something went wrong!", error: "ServerError" }, { status: 500 }); // ตรวจสอบให้แน่ใจว่า error case return JSON
    }
}
