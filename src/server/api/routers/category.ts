import { createTRPCRouter, protectedProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
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
});
