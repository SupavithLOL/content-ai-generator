import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {db} from "./db";
import { compare } from "bcrypt";
import { generateVerificationToken } from "./token";
import { getUserByEmail, getUserById } from "@/data/user";
import { sendVerificationEmail } from "./mail";

export const authOptions: NextAuthOptions ={
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET, // ใช้ NEXTAUTH_SECRET จาก Environment Variable
    session: {
        strategy: "jwt"
    },
    pages:{
        signIn: "/auth/sign-in",
      },
    providers: [
        GoogleProvider({ 
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "email", placeholder: "Email" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
            if(!credentials?.email || !credentials?.password){
                return null;
            }
            const existingUser = await getUserByEmail(credentials.email);

            if(!existingUser || !existingUser.email){
                return null;
            }

            if(!existingUser.emailVerified){
              const verificationToken = await generateVerificationToken(
                existingUser.email,
              );

              //send email verification
              await sendVerificationEmail(verificationToken.email, verificationToken.token);

              return Promise.reject(new Error("EmailNotVerified"));
            }

            const passwordMatch = await compare(credentials.password, existingUser.password);
            if(!passwordMatch){
                return null;
            }

            return {
                id: `${existingUser.id}`,
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role,
            }
          }
        })
    ],
    callbacks: {
      async signIn({user, account}) {
        console.log(account);
        //callback ถ้า user ยังไม่ verified จะไม่สามารถเข้าไปได้
        const existingUser = await getUserById(user.id);
        if(!existingUser?.emailVerified) return false;
        return true;
      },
      async jwt({ token, user }) {
          if(user){
              return {
                  ...token,
                  id: user.id,
                  username: user.username,
                  email: user.email,
                  role: user.role, 
              }
          }
        return token;
      },
      async session({ session, token }) {
        return {
            ...session,
            user:{
                ...session.user,
                id: token.id,
                username: token.username,
                email: token.email,
                role: token.role,
           }
        }
      },
    }
}