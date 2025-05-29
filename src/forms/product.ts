import { z } from "zod";

export const productFormSchema = z.object({
  price: z.number().min(1000),
  categoryId: z.string(),
});

export type ProductFormSchema = z.infer<typeof productFormSchema>;
