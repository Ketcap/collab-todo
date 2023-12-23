"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

export const LoginButton = () => {
  return (
    <Button
      onClick={() => {
        signIn("github");
      }}
    >
      Signin with GitHub
    </Button>
  );
};
