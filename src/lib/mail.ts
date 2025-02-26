import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (
    email: string,
    token: string,
) => {
    const resetLink = `http://localhost:3000/new-password?token=${token}`

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    });
};

export const sendVerificationEmail = async (email: string, token: string) => {
    //เปลี่ยน path เมื่อ deploy เพื่อที่จะส่งเมลไปยัง mail อื่นๆได้
    //ไม่สามารถส่งไปยัง email อื่นนอกเหนือจาก email ที่ลงทะเบียนใน resend ได้
    const confirmLink = `http://localhost:3000/new-verification?token=${token}`;
    await resend.emails.send({
        from: "onboarding@resend.dev", //mail ฟรีของ Resend ที่จะใช้ได้ฟรี
        to: email,
        subject: "Verify your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    })
    console.log("Resend API Key:", process.env.RESEND_API_KEY);
}