import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  //read
  getCategories: protectedProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
        productCount: true,
      },
    });
    return categories;
  }),

  //insert
  createCategory: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3, "Minimun 3 of characters"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const newCategory = await db.category.create({
        data: {
          name: input.name,
        },
      });
      return newCategory;
    }),
});
