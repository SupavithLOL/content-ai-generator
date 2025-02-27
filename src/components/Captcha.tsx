"use client"
import { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the FormValues interface to specify the types of form input
interface FormValues {
    name: string;
    email: string;
}

// Declares the grecaptcha variable to be used in the component
declare global {
    interface Window {
        grecaptcha: any;
    }
}

export default function Home() {
    // State variables to manage reCAPTCHA
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [isCaptchaSolved, setIsCaptchaSolved] = useState<boolean>(false);
    const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);

    // useRef hook to store the reCAPTCHA widget ID
    const recaptchaRef = useRef<any>(null);

    // Use React Hook Form to manage the form state
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValues>();

    // Retrieve the reCAPTCHA site key from environment variables
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    // useEffect hook to load the reCAPTCHA script and initialize the widget
    useEffect(() => {
        // Check if the reCAPTCHA script is already loaded to prevent duplicates
        if (document.querySelector(`script[src*="recaptcha/api.js"]`)) {
            return;
        }

        // Create and append the reCAPTCHA script
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit`;
        script.async = true;
        script.defer = true;

        // Callback function to be executed after reCAPTCHA script has loaded
        window.onloadCallback = () => {
            if (!siteKey) {
                console.error("reCAPTCHA site key is missing.");
                toast.error("reCAPTCHA site key is missing.", { position: "top-center" });
                return;
            }

            // Render the reCAPTCHA widget
            window.grecaptcha.render(recaptchaRef.current, {
                'sitekey': siteKey,
                'callback': onCaptchaVerify,
                'expired-callback': onCaptchaExpired
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
            const response = await fetch('/api/captcha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            // Parse the JSON response from the server
            const data = await response.json() as { success: boolean; message: string };

            // Display success or error message based on the response from server
            if (data.success) {
                toast.success('Captcha verified successfully!', { position: "top-center" });
                setIsCaptchaSolved(true);
                return true;
            } else {
                toast.error('Captcha verification failed. Please try again.', { position: "top-center" });
                setIsCaptchaSolved(false);
                return false;
            }
        } catch (error) {
            console.error('Error verifying captcha:', error);
            toast.error('An error occurred while verifying captcha.', { position: "top-center" });
            setIsCaptchaSolved(false);
            return false;
        }
    };

    // Function to handle the form submission
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setSubmitAttempted(true);

        // Check if reCAPTCHA has been solved
        if (!captchaToken) {
            toast.error('Please complete the reCAPTCHA first.', { position: "top-center" });
            return;
        }

        // Call the verifyCaptcha function to check the token
        const isVerified = await verifyCaptcha(captchaToken);

        // Proceed or prevent submission based on captcha verification
        if (isVerified) {
            toast.success('Form submitted successfully!', { position: "top-center" });
            reset();
            setCaptchaToken(null);
            setIsCaptchaSolved(false);
            if (recaptchaRef.current) {
                window.grecaptcha.reset(recaptchaRef.current.widgetId);
            }
        } else {
            toast.error('Form submission failed. Please try again.', { position: "top-center" });
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
        toast.warn('Captcha has expired. Please solve it again.', { position: "top-center" });
    };

    // Render the component UI
    return (
        <div style={{ padding: '20px' }}>
            <h1>reCAPTCHA Example</h1>
            <ToastContainer />

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Form fields */}
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" {...register("name", { required: "Name is required" })} />
                    {errors.name && <span>{errors.name.message}</span>}
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })} />
                    {errors.email && <span>{errors.email.message}</span>}
                </div>

                {/* reCAPTCHA element - the container where reCAPTCHA will be rendered */}
                <div ref={recaptchaRef}></div>

                {/* Submit button */}
                <button type="submit" disabled={!isCaptchaSolved && submitAttempted}>
                    Submit
                </button>
            </form>
        </div>
    );
}