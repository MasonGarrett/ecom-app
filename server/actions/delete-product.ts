'use server';

import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { db } from '..';
import { products } from '../schema';

const action = createSafeActionClient();

export const deleteProduct = action(
    z.object({ id: z.number() }),
    async ({ id }) => {
        try {
            const data = await db
                .delete(products)
                .where(eq(products.id, id))
                .returning();
            revalidatePath('/dashboard/products');
            return { success: `Product ${data[0].title} has been deleted` };
        } catch (error) {
            return { error: 'Failed to delete product' };
        }
    }
);
