import { z } from 'zod';

export const ProductSchema = z.object({
    id: z.number().optional(),
    title: z
        .string()
        .min(5, { message: 'Title must be at lest 5 characters long' }),
    description: z
        .string()
        .min(40, { message: 'Description must be at lest 40 characters long' }),
    price: z.coerce
        .number({ invalid_type_error: 'Price must be a number' })
        .positive({ message: 'Price must be a postive number' }),
});

export type zProductSchema = z.infer<typeof ProductSchema>;
