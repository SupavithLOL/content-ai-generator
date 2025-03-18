import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { hash } from 'bcrypt';
import * as z from 'zod';
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

// Define a schema for input validation
const userSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have more than 8 characters"),
  });
  
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, username, password } = userSchema.parse(body)
        

        // Check if email exists
        const existingUserByEmail = await db.user.findUnique({
            where: { email: email }
        });

        //  ถ้ามี Email ในระบบแล้ว และยืนยันไปแล้ว → ห้ามสมัครซ้ำ
        if (existingUserByEmail && existingUserByEmail.emailVerified) {
            return NextResponse.json({ user: null, message: "User with this email already exists" }, { status: 409 });
        }

        //  ถ้ามี Email แต่ยังไม่ยืนยัน → ให้ Resend Verification Email
        if (existingUserByEmail && !existingUserByEmail.emailVerified) {
            const now = new Date();
            // เช็คว่าหมดอายุหรือยัง
            if (existingUserByEmail.verificationTokenExpires && now < existingUserByEmail.verificationTokenExpires) {
                return NextResponse.json({ message: "Verification email already sent. Please check your inbox." }, { status: 400 });
            }

            //  Generate new token และอัปเดตลง Database
            const verificationToken = await generateVerificationToken(email);
            await db.user.update({
                where: { email: email },
                data: {
                    verificationToken: verificationToken.token,
                    verificationTokenExpires: new Date(Date.now() + 60 * 60 * 1000) // Expire in 1 hrs
                }
            });

            //  Resend verification email
            await sendVerificationEmail(verificationToken.email, verificationToken.token);
            return NextResponse.json({ message: "New verification email has been sent" }, { status: 200 });
        }

        // Check username already exists
        const existingUserByUsername = await db.user.findUnique({
            where: { username: username }
        })

        if(existingUserByUsername){
            return NextResponse.json({ user: null, message: "User with this username already exists" }, { status: 400 });
        }

        // ถ้า Email ไม่เคยสมัครมาก่อน → ให้สร้าง User ใหม่
        const hashedPassword = await hash(password, 10);
        const verificationToken = await generateVerificationToken(email);

        const newUser = await db.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                emailVerified: null,
                verificationToken: verificationToken.token,
                verificationTokenExpires: new Date(Date.now() + 60 * 60 * 1000), // Expire in 1 hrs
                role: "USER",
            }
        });

        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return NextResponse.json({ message: "Verification email has been sent", user: newUser }, { status: 201 });

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
}
