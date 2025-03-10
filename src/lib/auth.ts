import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {db} from "./db";
import { compare } from "bcrypt";
import { generateVerificationToken } from "./token";
import { getUserByEmail, getUserById } from "@/data/user";
import { sendVerificationEmail } from "./mail";

export const authOptions: NextAuthOptions ={
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    pages:{
        signIn: "/auth/sign-in",
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

            const activeSubscription = await db.subscription.findFirst({
              where: {
                userId: existingUser.id,
                status: "ACTIVE",
              },
              include: {
                plan: true,
              },
            });

            await new Promise(resolve => setTimeout(resolve, 100));

            return {
                id: `${existingUser.id}`,
                username: existingUser.username,
                email: existingUser.email,
                createdAt: existingUser.createdAt,
                role: existingUser.role,
                subscription: activeSubscription
                  ? {
                      stripeSubscriptionId: activeSubscription.stripeSubscriptionId,
                      planId: activeSubscription.planId,
                      planName: activeSubscription.plan.name,
                      status: activeSubscription.status,
                      startDate: activeSubscription.startDate,
                      endDate: activeSubscription.endDate,
                      currentPeriodEnd: activeSubscription.currentPeriodEnd, 
                      cancelAtPeriodEnd: activeSubscription.cancelAtPeriodEnd
                    }
                  : null,
            };
          },
        })
    ],
    callbacks: {
      async signIn({user, account}) {
        // console.log(user);
        //callback ถ้า user ยังไม่ verified จะไม่สามารถเข้าไปได้
        const existingUser = await getUserById(user.id);
        if(!existingUser?.emailVerified) return false;
        return true;
      },
      async jwt({ token, user }) {
        // console.log("User Object in JWT Callback:", user);
          if(user){
            const activeSubscription = await db.subscription.findFirst({
              where: {
                userId: user.id,
                status: "ACTIVE",
              },
              include: {
                plan: true,
              },
            });
              return {
                  ...token,
                  id: user.id,
                  username: user.username,
                  email: user.email,
                  createdAt: user.createdAt,
                  role: user.role,
                  subscription: activeSubscription 
                  ? {
                      stripeSubscriptionId: activeSubscription.stripeSubscriptionId,
                      planId: activeSubscription.planId,
                      planName: activeSubscription.plan.name,
                      status: activeSubscription.status,
                      startDate: activeSubscription.startDate,
                      endDate: activeSubscription.endDate,
                      currentPeriodEnd: activeSubscription.currentPeriodEnd,
                      cancelAtPeriodEnd: activeSubscription.cancelAtPeriodEnd, 
                    }
                  : null,
              }
          }
        return token;
      },
      async session({ session, token }) {
        // console.log("Token in Session Callback:", token);
        return {
            ...session,
            user:{
                ...session.user,
                id: token.id,
                username: token.username,
                email: token.email,
                createdAt: token.createdAt,
                role: token.role,
                subscription: token.subscription || null,
           }
        }
      },
    }
}