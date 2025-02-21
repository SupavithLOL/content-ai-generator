"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
const Social = () => {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button size="lg" className="w-full" variant="outline">
        <FcGoogle className="h-5 w-5" /> Google
      </Button>
      <Button size="lg" className="w-full" variant="outline">
        <FaGithub className="h-5 w-5" /> Github
      </Button>
    </div>
  );
};

export default Social;
