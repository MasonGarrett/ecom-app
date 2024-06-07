'use server';

import { VariantSchema } from '@/types/variant-schema';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';
import { db } from '..';
import { productVariants, variantImages, variantTags } from '../schema';

const action = createSafeActionClient();

export const createVariant = action(
    VariantSchema,
    async ({
        id,
        color,
        editMode,
        productID,
        productType,
        tags,
        variantImages: newImgs,
    }) => {
        try {
            if (editMode && id) {
                const editVariant = await db
                    .update(productVariants)
                    .set({ color, productType, updated: new Date() })
                    .returning();

                await db
                    .delete(variantTags)
                    .where(eq(variantTags.variantID, editVariant[0].id));

                await db.insert(variantTags).values(
                    tags.map((tag) => ({
                        tag,
                        variantID: editVariant[0].id,
                    }))
                );

                await db
                    .delete(variantImages)
                    .where(eq(variantImages.variantID, editVariant[0].id));

                await db.insert(variantImages).values(
                    newImgs.map((img, idx) => ({
                        name: img.name,
                        size: img.size,
                        variantImages: editVariant[0].id,
                        url: img.url,
                        order: idx,
                    }))
                );
                revalidatePath('/dashboard/products');
                return { success: `Edited ${productType}` };
            }
            if (!editMode) {
                const newVariant = await db
                    .insert(productVariants)
                    .values({ color, productType, productID })
                    .returning();

                await db.insert(variantTags).values(
                    tags.map((tag) => ({
                        tag,
                        variantID: newVariant[0].id,
                    }))
                );

                await db.insert(variantImages).values(
                    newImgs.map((img, idx) => ({
                        name: img.name,
                        size: img.size,
                        variantImages: newVariant[0].id,
                        url: img.url,
                        order: idx,
                    }))
                );
                revalidatePath('/dashboard/products');
                return { success: `Added ${productType}` };
            }
        } catch (error) {
            return { error: 'Failed to create variant' };
        }
    }
);
