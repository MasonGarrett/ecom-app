'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createProduct } from '@/server/actions/create-product';
import { getProduct } from '@/server/actions/get-product';
import { ProductSchema, zProductSchema } from '@/types/product-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { DollarSign } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Tiptap from './tiptap';

const ProductForm = () => {
    const form = useForm<zProductSchema>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            title: '',
            description: '',
            price: 0,
        },
        mode: 'onChange',
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    const editMode = searchParams.get('id');

    const checkProduct = async (id: number) => {
        if (editMode) {
            const data = await getProduct(id);

            if (data.error) {
                toast.error(data.error);
                router.push('/dashboard/products');
                return;
            }
            if (data.success) {
                const id = parseInt(editMode);
                form.setValue('title', data.success.title);
                form.setValue('description', data.success.description);
                form.setValue('price', data.success.price);
                form.setValue('id', id);
            }
        }
    };

    useEffect(() => {
        if (editMode) {
            checkProduct(parseInt(editMode));
        }
    }, []);

    const { execute, status } = useAction(createProduct, {
        onSuccess: (data) => {
            if (data?.error) {
                toast.error(data.error);
            }
            if (data?.success) {
                router.push('/dashboard/products');
                toast.success(data.success);
            }
        },
        onExecute: (data) => {
            if (editMode) {
                toast.loading('Updating Product');
            }
            if (!editMode) {
                toast.loading('Creating Product');
            }
        },
    });

    async function onSubmit(values: zProductSchema) {
        execute(values);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {editMode ? 'Edit Product' : 'Create Product'}
                </CardTitle>
                <CardDescription>
                    {editMode
                        ? 'Make changes to existing product'
                        : 'Add a brand new product'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Saekdong Stripe"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Tiptap val={field.value} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Price</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <DollarSign
                                                size={36}
                                                className="p-2 bg-muted rounded-md"
                                            />
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="Your price in USD"
                                                step="0.1"
                                                min={0}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={
                                status === 'executing' ||
                                !form.formState.isValid ||
                                !form.formState.isDirty
                            }
                            className="w-full"
                            type="submit"
                        >
                            {editMode ? 'Save Changes' : 'Create Product'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default ProductForm;
