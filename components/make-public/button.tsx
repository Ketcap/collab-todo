"use client";
import { useState } from "react";
import { TodoCategory } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { toast } from "sonner";
import usePartySocket from "partysocket/react";
import { NotificationAction } from "../../party/notifications";
import { Session } from "next-auth";
import { makeCategoryPublic } from "@/server/todo-category/actions";

export type MakePublicButtonProps = {
  category: TodoCategory;
  isPublic: boolean;
  session?: Session | null;
};

export const MakePublicButton = ({
  category,
  isPublic,
  session,
}: MakePublicButtonProps) => {
  const [isCategoryPublic, setIsCategoryPublic] = useState(isPublic);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const notificationSocket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTY_KIT_URL as string,
    room: "list",
    party: "notifications",
  });

  const onConfirm = async () => {
    setIsLoading(true);
    try {
      await makeCategoryPublic(category.id);
      setIsOpen(false);
      toast.success("List is now public", {
        action: {
          label: "Copy URL",
          onClick: () => {
            navigator.clipboard.writeText(
              `${window.location.origin}/l/${category.id}`
            );
            toast.success("URL copied to clipboard");
          },
        },
      });
      notificationSocket.send(
        JSON.stringify({
          categoryId: category.id,
          action: "update",
          message: `List "${category.name}" is now public`,
          time: new Date(),
          avatarUrl: session?.user.image,
          name: session?.user.name,
          userId: session?.user.id,
        } as NotificationAction)
      );
      setIsCategoryPublic(true);
    } catch (e) {
      toast.error("Couldn't delete the list");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCategoryPublic) {
    return <Badge>Public</Badge>;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <AlertDialogTrigger>
        <Button asChild variant={"ghost"}>
          <Badge className="cursor-pointer">Make Public</Badge>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {'Do you want to make list "Public"'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will make your list public and anyone with the link can see it.
            <br />
            <b>The action is irreversible.</b>
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <Button
              variant={"secondary"}
              disabled={isLoading}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Make Public
            </Button>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};
