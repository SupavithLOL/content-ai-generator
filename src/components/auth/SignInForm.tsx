"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Slide } from "react-toastify";
import CardWrapper from "./CardWrapper";
import Link from "next/link";

/**
 * Schema validation สำหรับฟอร์ม Sign In ด้วย Zod
 */
const SignInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
});

/**
 * Component ฟอร์มสำหรับ Sign In
 * @returns {JSX.Element} SignInForm component
 */
const SignInForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * ฟังก์ชัน handleSubmit สำหรับฟอร์ม Sign In
   * @param {z.infer<typeof FormSchema>} values - ค่าจากฟอร์ม
   */

  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    console.log("signInData:", signInData); // Debug ดูค่า signInData

    if (signInData?.error) {
      let errorMessage = "Wrong Email or Password";
      let errorType = "GenericError";

      if (signInData?.error) {
        errorType = signInData.error as string;
      }

      if (errorType === "EmailNotVerified") {
        errorMessage =
          "Email not verified. Please check your inbox to verify your email.";
        toast.warn(errorMessage, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
      } else {
        toast.error(errorMessage, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
      }

      return; // **สำคัญ! ป้องกันการ redirect ถ้า login ไม่ผ่าน**
    }

    console.log(
      "SignInForm: Sign in successful - Redirecting to admin dashboard..."
    );
    router.push("/user/profile");
    router.refresh();
  };

  return (
    <CardWrapper
      headerLabel="Sign in"
      backButtonLabel="Don't have Account"
      backButtonHref="/sign-up"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="mail@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    size="sm"
                    variant="link"
                    asChild
                    className="px-0 font-normal text-blue-500 hover:underline"
                  >
                    <Link href="/reset-password">Forgot Password</Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="w-full mt-6" type="submit">
            Sign in
          </Button>
        </form>
      </Form>
      <ToastContainer />
    </CardWrapper>
  );
};

export default SignInForm;
