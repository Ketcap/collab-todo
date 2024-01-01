"use client";
import { Maximize2 } from "lucide-react";
import { Button } from "../ui/button";

export const ExitIntercept = () => (
  <div className={"fixed -right-[20px] -top-[20px]"}>
    <Button variant={"link"} size="iconSm" onClick={() => location.reload()}>
      <Maximize2 size={20} color="#fff" />
    </Button>
  </div>
);
