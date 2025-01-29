"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const SignOutButton: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = (props) => {
  const router = useRouter();

  const handleLogout = async () => {
    // Implement your logout logic here
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/"); // Redirect to home after logout
  };

  return (
    <Button onClick={handleLogout} className={props.className}>
      {props.children}
    </Button>
  );
};

export default SignOutButton;
