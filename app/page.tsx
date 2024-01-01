import { TodoCategory } from "@prisma/client";
import { getServerSession } from "next-auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryList } from "@/components/todo-list/category-list";

import { prisma } from "@/lib/prisma";

import { addNewCategory } from "@/server/todo-category/actions";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MainPage() {
  const session = await getServerSession(authOptions);
  let data: TodoCategory[] = [];

  const isLoggedIn = session?.user;
  if (isLoggedIn) {
    data = await prisma.todoCategory.findMany({
      where: {
        userId: session.user.id,
      },
    });
  }

  return (
    <Card className="w-[100%] max-w-[500px]">
      <CardHeader>
        <CardTitle>Collab-Todo</CardTitle>
        <CardDescription>
          You can create your to-do lists and share them with your friends,
          collaborate with others.
          <br />
          Example: You can add list of bosses you want to kill.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoggedIn && (
          <CategoryList
            categories={data}
            onSubmit={addNewCategory}
            session={session}
          />
        )}
      </CardContent>
    </Card>
  );
}
