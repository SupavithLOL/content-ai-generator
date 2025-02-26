import { getUserByEmail } from "@/data/user";
import * as z from "zod";
import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/token";

const ResetSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = ResetSchema.parse(body);

        if (!email) {
            return NextResponse.json({ message: "Invalid Email" }, { status: 400 });
        }

        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return NextResponse.json({ message: "Email not found" }, { status: 404 });
        }

        const passwordResetTOken = await generatePasswordResetToken(email);
        await sendPasswordResetEmail(
            passwordResetTOken.email,
            passwordResetTOken.token,
        )

        return NextResponse.json({ message: "Reset Email Sent" }, { status: 200 });

    } catch (error) {
        console.error("Error resending verification email:", error);
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
}