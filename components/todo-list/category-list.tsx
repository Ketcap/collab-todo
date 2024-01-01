"use client";
import { Fragment, useState } from "react";
import { TodoCategory } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import usePartySocket from "partysocket/react";
import { Session } from "next-auth";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { CategoryListItem } from "./category-list-item";
import { TodoCategorySchema, todoCategorySchema } from "../add-todo/lib";
import { NotificationAction } from "../../party/notifications";
import { Checkbox } from "../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { AddNewCategory } from "@/server/todo-category/actions";

export type CategoryListProps = {
  categories: TodoCategory[];
  session?: Session | null;

  onSubmit: AddNewCategory;
};

export const CategoryList = ({
  categories = [],
  onSubmit,
  session,
}: CategoryListProps) => {
  const shouldReduceMotion = useReducedMotion();

  const { push } = useRouter();
  const [list, setList] = useState<TodoCategory[]>(categories);
  const [isLoading, setIsLoading] = useState(false);

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTY_KIT_URL as string,
    room: "list",
    party: "notifications",
  });

  const form = useForm<TodoCategorySchema>({
    resolver: zodResolver(todoCategorySchema),
    defaultValues: {
      name: "",
      isPublic: true,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setIsLoading(true);
    try {
      const category = await onSubmit(values);
      form.reset();
      setList((prev) => [...prev, category]);
      if (category.isPublic) {
        socket.send(
          JSON.stringify({
            categoryId: category.id,
            message: `${session?.user?.name} created a new list: ${category.name}`,
            time: category.createdAt,
            name: session?.user.name,
            userId: session?.user.id,
            avatarUrl: session?.user.image,
          } satisfies NotificationAction)
        );
      }
      push(`/l/${category.id}`);
    } catch (e) {
      toast("Couldn't create todo", { dismissible: true });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid grid-flow-row gap-3 overflow-hidden">
        <Form {...form}>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-row flex-1">
              <Input
                {...form.register("name")}
                className="flex-1 mr-4"
                placeholder="Things to do in Blackwing Lair "
              />
              <Button
                className="w-24"
                variant="secondary"
                isLoading={isLoading}
                type="submit"
              >
                Add List
              </Button>
            </div>
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex gap-2 pt-3 space-y-0 items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Make my list Public</FormLabel>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Separator />
        {list.map((category, index) => (
          <Fragment key={index}>
            <motion.div
              initial={{ y: -25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              key={category.id}
              transition={{
                delay: index * 0.15,
                ease: "easeInOut",
              }}
            >
              <CategoryListItem {...category} key={category.id} />
            </motion.div>
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: (index + 1) * 0.15,
              }}
            >
              {categories.length !== index + 1 && <Separator />}
            </motion.div>
          </Fragment>
        ))}
      </div>
    </MotionConfig>
  );
};
