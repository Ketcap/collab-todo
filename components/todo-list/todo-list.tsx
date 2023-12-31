"use client";
import { Todo, TodoCategory } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

import { AddTodo, AddTodoProps } from "../add-todo";
import { TodoListItem } from "./todo-list-item";
import {
  addNewTodo,
  todoToggleStatus,
  deleteTodo,
} from "@/server/todo/actions";
import usePartySocket from "partysocket/react";
import { ServerAction } from "../../party";
import { NotificationAction } from "../../party/notifications";
import { Session } from "next-auth";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

export type TodoListProps = {
  // Component Props
  todos: Todo[];
  category: TodoCategory;
  canDoActions: boolean;
  // Session
  session?: Session | null;
};

export const TodoList = ({
  category,
  canDoActions,
  todos = [],
  session,
}: TodoListProps) => {
  const [todo, setTodos] = useState<Todo[]>(todos);
  const notificationSocket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTY_KIT_URL as string,
    room: "list",
    party: "notifications",
  });
  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTY_KIT_URL as string,
    room: category.id,
    onMessage(event) {
      const {
        action,
        todoId,
        todo: updatedTodo,
      } = JSON.parse(event.data) as ServerAction;
      if (action === "update" && updatedTodo) {
        setTodos((prev) =>
          prev.map((todo) => (todo.id === todoId ? updatedTodo : todo))
        );
      }
      if (action === "delete") {
        setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
      }
      if (action === "create" && updatedTodo) {
        setTodos((prev) => [...prev, updatedTodo]);
      }
    },
  });

  const handleSubmit: AddTodoProps["onSubmit"] = async (values) => {
    try {
      const newTodo = await addNewTodo(values, category.id);
      socket.send(
        JSON.stringify({
          action: "create",
          categoryId: category.id,
          todoId: newTodo.id,
          todo: newTodo,
        } satisfies ServerAction)
      );
      if (category.isPublic) {
        notificationSocket.send(
          JSON.stringify({
            categoryId: category.id,
            message: `${session?.user?.name} added a new todo: ${newTodo.description}`,
            time: newTodo.createdAt,
            name: session?.user.name,
            userId: session?.user.id,
            avatarUrl: session?.user.image,
          } satisfies NotificationAction)
        );
      }
      setTodos((prev) => [...prev, newTodo]);
    } catch {
      toast("Couldn't create todo", { dismissible: true });
    }
  };

  const handleChange = async (id: string, isChecked: boolean) => {
    const currentTodo = todo.find((todo) => todo.id === id);
    if (!currentTodo) return;
    try {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? { ...todo, completedAt: isChecked ? new Date() : null }
            : todo
        )
      );
      const newTodo = await todoToggleStatus(id, isChecked);
      socket.send(
        JSON.stringify({
          action: "update",
          todo: newTodo,
          categoryId: category.id,
          todoId: id,
        } satisfies ServerAction)
      );
      if (category.isPublic) {
        notificationSocket.send(
          JSON.stringify({
            categoryId: category.id,
            message: `${session?.user?.name} ${
              newTodo.completedAt ? "completed" : "un-completed"
            } todo: ${newTodo.description}`,
            time: newTodo.updatedAt,
            name: session?.user.name,
            userId: session?.user.id,
            avatarUrl: session?.user.image,
          } satisfies NotificationAction)
        );
      }
    } catch {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? todo : { ...currentTodo }))
      );
      toast("Couldn't update todo", { dismissible: true });
    }
  };

  const handleDelete = async (id: string) => {
    const currentTodo = todo.find((todo) => todo.id === id);
    if (!currentTodo) return;
    try {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      await deleteTodo(id);
      socket.send(
        JSON.stringify({
          action: "delete",
          categoryId: category.id,
          todoId: id,
        } satisfies ServerAction)
      );
      if (category.isPublic) {
        notificationSocket.send(
          JSON.stringify({
            categoryId: category.id,
            message: `${session?.user?.name} deleted a todo.`,
            time: new Date(),
            name: session?.user.name,
            userId: session?.user.id,
            avatarUrl: session?.user.image,
          } satisfies NotificationAction)
        );
      }
    } catch {
      setTodos((prev) => [...prev, currentTodo]);
      toast("Couldn't delete todo", { dismissible: true });
    }
  };

  return (
    <>
      {canDoActions && <AddTodo onSubmit={handleSubmit} />}
      <div className={"mb-3"} />
      <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {todo.map((task, index) => (
            <motion.div
              initial={{
                x: -15,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
                transition: {
                  delay: 0.025 * index,
                },
              }}
              exit={{
                x: 15,
                opacity: 0,
              }}
              key={task.id}
            >
              <TodoListItem
                actionsEnabled={canDoActions}
                todo={task}
                onToggle={handleChange}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </MotionConfig>
    </>
  );
};
