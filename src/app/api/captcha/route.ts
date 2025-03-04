import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ success: false, message: 'reCAPTCHA token missing.' }, { status: 400 });
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;

        if (!secretKey) {
            console.error('RECAPTCHA_SECRET_KEY is not defined in environment variables.');
            return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
        }

        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

        const response = await axios.post(verificationURL);
        const { success } = response.data;

        if (success) {
            return NextResponse.json({ success: true, message: 'reCAPTCHA verification successful!' }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: 'reCAPTCHA verification failed.' }, { status: 400 });
        }
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
    }
}