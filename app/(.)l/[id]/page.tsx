import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { prisma } from "../../../lib/prisma";
import { CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { MakePublicButton } from "../../../components/make-public/button";
import {
  addNewTodo,
  deleteTodo,
  makeCategoryPublic,
  todoToggleStatus,
} from "../../l/[id]/actions";
import { TodoList } from "../../../components/todo-list/todo-list";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { DialogHeader } from "../../../components/ui/dialog";

export default async function ModalTodos({
  params,
}: {
  params: { id: string };
}) {
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
    <>
      <DialogHeader className="flex flex-row justify-between items-center">
        <Button asChild variant={"ghost"}>
          <Link href={"/"}>
            <ChevronLeft />
          </Link>
        </Button>
        {name}
        <MakePublicButton
          category={category}
          onMakePublic={makeCategoryPublic}
          isPublic={isPublic}
          session={session}
        />
      </DialogHeader>
      <CardDescription className="text-center">
        You can add list of bosses you want to kill.
      </CardDescription>
      <TodoList
        canDoActions={canDoActions}
        category={category}
        todos={Todos}
        onSubmit={addNewTodo}
        onToggle={todoToggleStatus}
        onDelete={deleteTodo}
        session={session}
      />
    </>
  );
}
