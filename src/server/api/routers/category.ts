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
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
    return categories;
  }),

  //insert
  createCategory: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3, "Minimun 3 of character"),
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

  //delete
  deleteCategoryById: protectedProcedure
    .input(z.object({ categoryId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      await db.category.delete({
        where: {
          id: input.categoryId,
        },
      });
    }),

  //update
  editCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
        name: z.string().min(3, "Minimun of 3 character"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      await db.category.update({
        where: {
          id: input.categoryId,
        },
        data: {
          name: input.name,
        },
      });
    }),
});
