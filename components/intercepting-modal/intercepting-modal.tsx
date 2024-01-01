"use client";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

export type InterceptingModalProps = {
  children: React.ReactNode;
};
export const InterceptingModal = ({ children }: InterceptingModalProps) => {
  const router = useRouter();
  return (
    <Dialog open={true} defaultOpen={true} onOpenChange={() => router.back()}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};
