"use client";
import usePartySocket from "partysocket/react";
import { useState } from "react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Card, CardTitle } from "../ui/card";
import { formatDistanceToNow } from "date-fns";
import { Maximize2, Minus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { NotificationAction } from "../../party/notifications";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const ActionList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [messages, setMessages] = useState<NotificationAction[]>([]);
  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTY_KIT_URL as string,
    room: "list",
    party: "notifications",

    onMessage(event) {
      const serverMessage = JSON.parse(event.data) as NotificationAction;
      setMessages((messages) => [...messages, serverMessage]);
      if (!isOpen) {
        setIsNew(true);
      }
    },
  });
  return (
    <Card
      className={cn(
        "fixed bottom-0 right-0 w-[300px] h-auto flex flex-col p-3 pb-0 rounded-b-none rounded-r-none transition-all ",
        isOpen ? "h-[300px]" : "h-[42px]"
      )}
    >
      {isNew && (
        <div className={"absolute -top-1 -left-1 flex h-3 w-3"}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500" />
        </div>
      )}
      <CardTitle
        onClick={() => {
          setIsNew(false);
          setIsOpen((isOpen) => !isOpen);
        }}
      >
        Events
      </CardTitle>
      <Button
        variant={"ghost"}
        size="iconSm"
        className="absolute right-1 top-1"
        onClick={() => {
          setIsNew(false);
          setIsOpen((isOpen) => !isOpen);
        }}
      >
        {isOpen ? <Minus /> : <Maximize2 />}
      </Button>
      {isOpen && (
        <ScrollArea className="mt-3 h-[260px] w-[100%] ">
          {messages.map(({ message, avatarUrl, name, time }, index) => (
            <>
              <div
                className={"min-h-[35px] pt-2 pb-2 flex-col"}
                key={index}
                ref={(ref) => {
                  index === messages.length - 1 && ref?.scrollIntoView();
                }}
              >
                <div className={"flex flex-row"}>
                  <Avatar>
                    <AvatarImage src={avatarUrl || ""} />
                    <AvatarFallback>
                      {name?.split(" ").map((n) => n[0])}
                    </AvatarFallback>
                  </Avatar>
                  <Label key={index} className={"pl-2 flex items-center"}>
                    {message}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground text-right">
                  {formatDistanceToNow(time)}
                </p>
              </div>
              {index !== messages.length - 1 && <Separator />}
            </>
          ))}
        </ScrollArea>
      )}
    </Card>
  );
};
