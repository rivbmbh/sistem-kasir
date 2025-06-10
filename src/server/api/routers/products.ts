import { z } from "zod";
// import { supabaseAdmin } from "@/server/supabase-admin";
// import { Bucket } from "@/server/bucket";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { supabaseAdmin } from "@/server/supabase-admin";
import { Bucket } from "@/server/bucket";
import type { Prisma } from "@prisma/client";

export const productRouter = createTRPCRouter({
  //read
  getProducts: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const whereClause: Prisma.ProductWhereInput = {};

      if (input.categoryId !== "all") {
        whereClause.categoryId = input.categoryId;
      }
      const products = await db.product.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return products;
    }),

  createProduct: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
        price: z.number().min(1000),
        categoryId: z.string(),
        // multipart/form-data | JSON
        imageUrl: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const newProduct = await db.product.create({
        data: {
          name: input.name,
          price: input.price,
          category: {
            connect: {
              id: input.categoryId,
            },
          },
          imageUrl: input.imageUrl,
        },
      });

      return newProduct;
    }),

  createProductImageUploadSignedUrl: protectedProcedure.mutation(async () => {
    const { data, error } = await supabaseAdmin.storage
      .from(Bucket.ProductImages)
      .createSignedUploadUrl(`${Date.now()}.jpeg`);

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }

    return data;
  }),

  deleteProductById: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      await db.product.delete({
        where: {
          id: input.productId,
        },
      });
    }),
});
