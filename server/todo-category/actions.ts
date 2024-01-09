"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { nanoId } from "../../lib/id";
import { prisma } from "../../lib/prisma";

import { authOptions } from "@/lib/auth";

import type { TodoCategorySchema } from "@/components/add-todo/lib";

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

export type MakeCategoryPublic = typeof makeCategoryPublic;
export const makeCategoryPublic = async (id: string) => {
  "use server";
  await prisma.todoCategory.update({
    where: {
      id,
    },
    data: {
      isPublic: true,
    },
  });
  revalidatePath(`/l/${id}`);
};
