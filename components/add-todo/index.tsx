"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { TodoSchema, todoSchema } from "./lib";

export type AddTodoProps = {
  onSubmit: (values: TodoSchema) => Promise<void>;
};

export const AddTodo = ({ onSubmit }: AddTodoProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<TodoSchema>({
    resolver: zodResolver(todoSchema),
    criteriaMode: "all",
    mode: "onSubmit",
    defaultValues: {
      description: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
      form.reset();
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-row justify-between gap-4"
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Kill Lich King at 9:00 AM"
                  {...field}
                  ref={(ref) => ref?.focus()}
                  onChange={(event) => {
                    if (event.currentTarget.enterKeyHint) {
                      form.handleSubmit(onSubmit)();
                    }
                    field.onChange(event);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant={"secondary"}
          disabled={isLoading}
          isLoading={isLoading}
        >
          Add
        </Button>
      </form>
    </Form>
  );
};
