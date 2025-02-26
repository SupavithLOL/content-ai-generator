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
import { ToastContainer, toast, Slide } from "react-toastify";
import CardWrapper from "./CardWrapper";

/**
 * Schema validation สำหรับฟอร์ม Sign In ด้วย Zod
 */
const ResetSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

/**
 * Component ฟอร์มสำหรับ Sign In
 * @returns {JSX.Element} SignInForm component
 */
const ResetForm = () => {
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  /**
   * ฟังก์ชัน handleSubmit สำหรับฟอร์ม Sign In
   * @param {z.infer<typeof FormSchema>} values - ค่าจากฟอร์ม
   */

  const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
        });
      } else {
        toast.error(data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } catch {
      toast.error("Somthing Went Wrong!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
    }
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/sign-in"
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
          </div>
          <Button className="w-full mt-6" type="submit">
            Send Reset Email
          </Button>
        </form>
      </Form>
      <ToastContainer />
    </CardWrapper>
  );
};

export default ResetForm;
