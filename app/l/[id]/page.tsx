import { ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { TodoList } from "@/components/todo-list/todo-list";
import { MakePublicButton } from "@/components/make-public/button";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!params.id) {
    return redirect("/");
  }

  const category = await prisma.todoCategory.findUnique({
    where: {
      id: params.id,
    },
    include: {
      Todos: {
        orderBy: {
          id: "desc",
        },
      },
    },
  });
  const isOwner = category?.userId === session?.user.id;

  if (!category || (!category.isPublic && !isOwner)) {
    return redirect("/");
  }

  const canDoActions = category.userId === session?.user.id;

  const { Todos, name, isPublic } = category;

  return (
    <Card className="w-[100%] max-w-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Button asChild variant={"ghost"}>
            <Link href={"/"}>
              <ChevronLeft />
            </Link>
          </Button>
          {name}
          <MakePublicButton
            category={category}
            isPublic={isPublic}
            session={session}
          />
        </CardTitle>
        <CardDescription>
          You can add list of bosses you want to kill.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <TodoList
          canDoActions={canDoActions}
          category={category}
          todos={Todos}
          session={session}
        />
      </CardContent>
    </Card>
  );
}
