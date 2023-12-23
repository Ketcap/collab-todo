import z from "zod";
import { minimumLength } from "../../lib/generic-error";

export type TodoSchema = z.infer<typeof todoSchema>;
export const todoSchema = z.object({
  description: z.string().min(2, minimumLength(2, "description")),
});

export type TodoCategorySchema = z.infer<typeof todoCategorySchema>;
export const todoCategorySchema = z.object({
  name: z.string().min(2, minimumLength(2, "name")),
  isPublic: z.boolean(),
});
