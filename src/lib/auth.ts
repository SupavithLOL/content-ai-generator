import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { generateVerificationToken } from "./token";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "./mail";

export const authOptions: NextAuthOptions ={
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    pages:{
        signIn: "/sign-in",
      },
    providers: [
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
            console.log("Existing User in Authorize:", existingUser);

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
                createdAt: existingUser.createdAt.toISOString(),
                role: existingUser.role,
            };
          },
        })
    ],
    callbacks: {
      async signIn() {
        return true;
      },
      async jwt({ token, user }) {
          if(user){
              return {
                  ...token,
                  id: user.id,
                  username: user.username,
                  email: user.email,
                  createdAt: user.createdAt,
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
                createdAt: token.createdAt,
                role: token.role,
           }
        }
      },
    }
}