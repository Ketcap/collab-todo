import { getServerSession } from "next-auth";

import { prisma } from "../lib/prisma";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import type { TodoCategorySchema } from "../components/add-todo/lib";
import { nanoId } from "../lib/id";

export type AddNewCategory = typeof addNewCategory;
export const addNewCategory = async (values: TodoCategorySchema) => {
  "use server";
  const user = await getServerSession(authOptions);
  const category = await prisma.todoCategory.create({
    data: {
      id: nanoId(),
      name: values.name,
      isPublic: values.isPublic,
      userId: user!.user.id,
    },
  });

  return category;
};
