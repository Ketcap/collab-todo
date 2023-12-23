"use client";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export const Signout = () => {
  return (
    <Button
      variant={"outline"}
      onClick={() => {
        signOut();
      }}
    >
      Signout
    </Button>
  );
};

export const DropdownSignout = () => {
  return (
    <DropdownMenuItem
      onClick={() => {
        signOut();
      }}
    >
      Logout
    </DropdownMenuItem>
  );
};
