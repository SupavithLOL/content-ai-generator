import * as z from "zod";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";

const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
});

export async function POST(req: Request) {
    try {
            const body = await req.json();
            const validatedBody = NewPasswordSchema.parse(body);
            const {password} = validatedBody;
            const { token } = body;
            
            if (!token) {
                return NextResponse.json({ message: "Missing token!" , error: "Missing token!"}, { status: 400 });
            }
    
            if (!password) {
                return NextResponse.json({ message: "Invalid password field!", error: "Invalid password field!" }, { status: 404 });
            }
    
            const existingToken = await getPasswordResetTokenByToken(token);
            
            if (!existingToken) {
                return NextResponse.json({ message: "Invalid Token", error: "Invalid Token" }, { status: 404 });
            }

            const hasExpired = new Date(existingToken.expires) < new Date();

            if(hasExpired) {
                return NextResponse.json({ message: "Token Expired", error: "Token Expired" }, { status: 400 });
            }

            const existingUser = await getUserByEmail(existingToken.email);

            if (!existingUser) {
                return NextResponse.json({ message: "Email Not Found", error: "Email Not Found" }, { status: 404 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await db.user.update({
                where: {id: existingUser.id},
                data: {password: hashedPassword}
            });

            await db.passwordResetToken.delete({
                where: {id: existingToken.id}
            })

    
            return NextResponse.json({ message: "Password Updated!" }, { status: 200 });
    
        } catch (error) {
            console.error("Error to reset password:", error);
            return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
        }
}