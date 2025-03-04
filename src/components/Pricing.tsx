"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: PricingFeature[];
  popular?: boolean;
  paymentLink?: string;
}

const Pricing = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly"
  );

  const plans: PricingPlan[] = [
    {
      name: "Starter",
      price: 100,
      description: "For businesses starting their content management",
      features: [
        { text: "3,000 credit / month" },
        { text: "Max 2 projects" },
        { text: "Max 20 keywords / month" },
        { text: "Share with up to 3 users" },
        { text: "10 competitor analyses" },
      ],
      paymentLink: process.env.SRTIP,
    },
    {
      name: "Pro",
      price: 200,
      description: "For businesses starting their content management",
      features: [
        { text: "5,000 credit / month" },
        { text: "Max 10 projects" },
        { text: "Max 50 keywords / month" },
        { text: "unlimited" },
        { text: "20 competitor analyses" },
      ],
      paymentLink: process.env.SRTIP,
      popular: true,
    },
    {
      name: "Enterprise",
      price: 300,
      description: "For businesses starting their content management",
      features: [
        { text: "8,000 credit / month" },
        { text: "unlimited" },
        { text: "unlimited" },
        { text: "unlimited" },
        { text: "30 competitor analyses" },
      ],
      paymentLink: process.env.SRTIP,
    },
  ];

  const calculatePrice = (basePrice: number) => {
    if (billingCycle === "annually") {
      // 10% discount for annual billing
      return (basePrice * 12 * 0.9) / 12;
    }
    return basePrice;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-4">
          Choose a plan that's right for you.
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Get transparent pricing with no hidden fees—what you see is what you
          pay. Whether you're just getting started or need advanced features,
          our plans are designed to fit your needs and budget.
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center rounded-md border border-gray-200 p-1 bg-white">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-md ${
              billingCycle === "monthly"
                ? "bg-black text-white"
                : "bg-transparent text-gray-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annually")}
            className={`px-4 py-2 rounded-md ${
              billingCycle === "annually"
                ? "bg-black text-white"
                : "bg-transparent text-gray-700"
            }`}
          >
            Annually (SAVE 10%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`relative flex flex-col ${
              plan.popular ? "bg-black text-white" : "bg-white"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 flex justify-center -translate-y-1/2">
                <Badge className="bg-amber-400 text-black hover:bg-amber-400">
                  MOST POPULAR
                </Badge>
              </div>
            )}

            <CardHeader className="text-center">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-bold">
                  ${calculatePrice(plan.price)}
                </span>
                <span className="ml-1 text-xl text-gray-400">/ month</span>
              </div>
              <p
                className={`mt-2 text-sm ${
                  plan.popular ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {plan.description}
              </p>
            </CardHeader>

            <CardContent className="flex-grow">
              <Button
                className={`w-full py-6 ${
                  plan.popular
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
                onClick={() => {
                  if (!session?.user) {
                    // // router.push("/sign-in");
                    // // เก็บแผนที่เลือกไว้ใน sessionStorage
                    // sessionStorage.setItem(
                    //   "selectedPlan",
                    //   JSON.stringify(plan)
                    // );
                    // Redirect ไปหน้า sign-in
                    router.push("/sign-in?redirectToPayment=true"); // เพิ่ม query redirectToPayment
                  } else {
                    if (plan.paymentLink) {
                      window.location.href = plan.paymentLink;
                    } else {
                      alert("Payment link is not available for this plan.");
                    }
                  }
                }}
              >
                Get Started
              </Button>
              {/* <Link href={plan.paymentLink}></Link> */}
            </CardContent>

            <CardFooter className="flex flex-col items-start w-full space-y-3 pt-6 border-t border-gray-200">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center">
                  <Check
                    className={`h-5 w-5 mr-2 ${
                      plan.popular ? "text-white" : "text-black"
                    }`}
                  />
                  <span
                    className={plan.popular ? "text-gray-300" : "text-gray-700"}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
