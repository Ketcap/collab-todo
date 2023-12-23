import { PrismaClient, Todo, TodoCategory, User } from "@prisma/client";
import { nanoId } from "../lib/id";

const prisma = new PrismaClient();

const init = async () => {
  const todoCategories = [
    {
      id: nanoId(),
      isPublic: false,
      name: "My Test Category",
    },
    {
      id: nanoId(),
      isPublic: false,
      name: "My Category",
    },
    {
      id: nanoId(),
      isPublic: false,
      name: "Shopping List",
    },
  ] satisfies Omit<TodoCategory, "userId" | "createdAt" | "updatedAt">[];

  const items = [
    {
      categoryId: todoCategories[0].id,
      description: "my test todo",
      id: nanoId(),
    },
    {
      categoryId: todoCategories[0].id,
      description: "my todo",
      id: nanoId(),
    },
    {
      categoryId: todoCategories[0].id,
      description: "test todo",
      id: nanoId(),
    },
    {
      categoryId: todoCategories[1].id,
      description: "my test todo",
      id: nanoId(),
    },
    {
      categoryId: todoCategories[1].id,
      description: "my test todo",
      id: nanoId(),
    },
    {
      categoryId: todoCategories[2].id,
      description: "test todo",
      id: nanoId(),
    },
    {
      categoryId: todoCategories[2].id,
      description: "my test todo",
      id: nanoId(),
    },
    {
      categoryId: todoCategories[2].id,
      description: "my test todo",
      id: nanoId(),
    },
  ] satisfies Omit<Todo, "completedAt" | "createdAt" | "updatedAt">[];

  const users = await prisma.user.findMany();

  users.map(async (user) => {
    const categories = await prisma.todoCategory.createMany({
      data: todoCategories.map((category) => ({
        ...category,
        userId: user.id,
      })),
    });

    const todo = await prisma.todo.createMany({
      data: items,
    });
  });
};

init();
