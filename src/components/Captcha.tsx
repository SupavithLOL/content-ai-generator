"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast, Slide } from "react-toastify";
import CardWrapper from "../components/form/CardWrapper";

// Define the FormValues interface to specify the types of form input
interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const formSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(8, "Password must have at least 8 characters"),
    confirmPassword: z.string().min(8, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// Declares the grecaptcha variable to be used in the component
declare global {
  interface Window {
    grecaptcha: any;
  }
}

const SignUpForm = () => {
  const router = useRouter();

  // State variables to manage reCAPTCHA
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isCaptchaSolved, setIsCaptchaSolved] = useState<boolean>(false);
  // const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);

  // useRef hook to store the reCAPTCHA widget ID
  const recaptchaRef = useRef<any>(null);

  // Retrieve the reCAPTCHA site key from environment variables
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Check if the reCAPTCHA script is already loaded to prevent duplicates
    if (document.querySelector(`script[src*="recaptcha/api.js"]`)) {
      return;
    }

    // Create and append the reCAPTCHA script
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit`;
    script.async = true;
    script.defer = true;

    // Callback function to be executed after reCAPTCHA script has loaded
    window.onloadCallback = () => {
      if (!siteKey) {
        console.error("reCAPTCHA site key is missing.");
        toast.error("reCAPTCHA site key is missing.", { position: "bottom-right" });
        return;
      }

      // Render the reCAPTCHA widget
      window.grecaptcha.render(recaptchaRef.current, {
        sitekey: siteKey,
        callback: onCaptchaVerify,
        "expired-callback": onCaptchaExpired,
      });
    };

    // Append the reCAPTCHA script to the document head
    document.head.appendChild(script);

    // Cleanup function to remove the script upon component unmount
    return () => {
      document.head.removeChild(script);
    };
  }, [siteKey]);

  // Async function to verify the reCAPTCHA token with the server
  const verifyCaptcha = async (token: string | null): Promise<boolean> => {
    if (!token) {
      console.log("reCAPTCHA token is null or empty.");
      return false;
    }

    try {
      // Send a POST request to verify the reCAPTCHA token
      const response = await fetch("/api/captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      // Parse the JSON response from the server
      const data = await response.json() as { success: boolean; message: string };

      // Display success or error message based on the response from server
      if (data.success) {
        toast.success("Captcha verified successfully!", {
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
        setIsCaptchaSolved(true);
        return true;
      } else {
        toast.error("Captcha verification failed. Please try again.", {
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
        setIsCaptchaSolved(false);
        return false;
      }
    } catch (error) {
      console.error("Error verifying captcha:", error);
      toast.error("An error occurred while verifying captcha.", {
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
      setIsCaptchaSolved(false);
      return false;
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    // Check if reCAPTCHA has been solved
    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA first.", {
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
      return;
    }

    // Call the verifyCaptcha function to check the token
    const isVerified = await verifyCaptcha(captchaToken);

    // Proceed or prevent submission based on captcha verification
    if (isVerified) {
      try {
        const response = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.username,
            email: values.email,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          router.push("/sign-in");
          toast.success('Registration Complete!', {
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

        } else {
          toast.error(data.message, {
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
      } catch (error) {
        console.error("An error occurred:", error);
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
      } finally {
        form.reset();
        setCaptchaToken(null);
        setIsCaptchaSolved(false);
        if (recaptchaRef.current) {
          window.grecaptcha.reset(recaptchaRef.current.widgetId);
        }
      }
    } else {
      toast.error("Form submission failed. Please try again.", {
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

  // Callback function executed when reCAPTCHA is successfully verified by the user
  const onCaptchaVerify = (token: string) => {
    console.log("reCAPTCHA Token:", token);
    setCaptchaToken(token);
    setIsCaptchaSolved(true);
  };

  // Callback function to handle expiration of the reCAPTCHA response
  const onCaptchaExpired = () => {
    console.log("reCAPTCHA Expired");
    setCaptchaToken(null);
    setIsCaptchaSolved(false);
    toast.warn("Captcha has expired. Please solve it again.", {
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
  };

  return (
    <CardWrapper
      headerLabel="Sign up"
      backButtonLabel="Already have an account"
      backButtonHref="/sign-in"
      // showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* reCAPTCHA element - the container where reCAPTCHA will be rendered */}
          <div ref={recaptchaRef}></div>
          <Button type="submit" className="w-full mt-4" disabled={!isCaptchaSolved}>
            Sign Up
          </Button>
        </form>
      </Form>
      <ToastContainer />
    </CardWrapper>
  );
};

export default SignUpForm;