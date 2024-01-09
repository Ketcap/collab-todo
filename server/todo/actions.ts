"use server";
import { nanoId } from "../../lib/id";
import { prisma } from "../../lib/prisma";

export type AddNewTodo = typeof addNewTodo;
export const addNewTodo = async (
  { description }: { description: string },
  categoryId: string
) => {
  "use server";
  const newTodo = await prisma.todo.create({
    data: {
      description,
      categoryId: categoryId,
      id: nanoId(),
    },
  });

  return newTodo;
};

export type TodoToggleStatus = typeof todoToggleStatus;
export const todoToggleStatus = async (id: string, isChecked: boolean) => {
  "use server";
  const updatedTodo = await prisma.todo.update({
    where: {
      id,
    },
    data: {
      completedAt: isChecked ? new Date() : null,
    },
  });

  return updatedTodo;
};

export type DeleteTodo = typeof deleteTodo;
export const deleteTodo = async (id: string) => {
  "use server";
  await prisma.todo.delete({
    where: {
      id,
    },
  });
};
