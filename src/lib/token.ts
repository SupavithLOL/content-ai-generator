// import { getVerificationTokenByEmail } from "@/data/verification-token";
// import {v4 as uuidv4} from "uuid";
// import {db} from "@/lib/db";

// export const generateVerificationToken = async (email:string) => {
//     const token =uuidv4()
//     const expires = new Date(new Date().getTime()+3600*1000);
//     const existingToken = await getVerificationTokenByEmail(email);

//     if(existingToken){
//         await db.verificationToken.delete({
//             where: {
//                 id: existingToken.id
//             }
//         })
//     }

//     const verificationToken = await db.verificationToken.create({
//         data: {
//             email,
//             token,
//             expires,
            
//         }
//     });
//     return verificationToken;
// };


import {v4 as uuidv4} from "uuid";
import {db} from "@/lib/db";
import { getPasswordResetTokenByTEmail } from "@/data/password-reset-token";
import { getVerificationTokenByEmail } from "@/data/verification-token";

export const generatePasswordResetToken = async (email:string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour expiration

    const existingToken = await getPasswordResetTokenByTEmail(email);

    if(existingToken){
        await db.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        });
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data:{
            email,
            token,
            expires
        }
    });

    return passwordResetToken
}

export const generateVerificationToken = async (email:string) => {
    try {
        const token =uuidv4()
        const expires = new Date(new Date().getTime()+3600*1000);
        const existingToken = await getVerificationTokenByEmail(email);

        if(existingToken){
            await db.verificationToken.delete({
                where: {
                    id: existingToken.id
                }
            });
            console.log("Existing verification token deleted for email:", email);
        }

        console.log("Creating new verification token for email:", email, "token:", token, "expires:", expires); // Log data ก่อน create
        const verificationToken = await db.verificationToken.create({
            data: {
                email,
                token,
                expires
            }
        });
        console.log("Verification token created successfully:", verificationToken);
        return verificationToken;
    } catch (error) {
        console.error("--- Error in generateVerificationToken ---");
        console.error("Error details:", error); // Log error ทั้งหมดในการสร้าง token
        throw error; // Re-throw error เพื่อให้ถูกจับใน /api/signup/route.ts
    }
};