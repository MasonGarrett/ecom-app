'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { VariantsWithImagesTags } from '@/lib/infer-type';
import { createVariant } from '@/server/actions/create-variant';
import { VariantSchema } from '@/types/variant-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import InputTags from './input-tags';
import VariantImages from './variant-images';

export const ProductVariant = ({
    editMode,
    productID,
    variant,
    children,
}: {
    editMode: boolean;
    productID?: number;
    variant?: VariantsWithImagesTags;
    children: React.ReactNode;
}) => {
    const form = useForm<z.infer<typeof VariantSchema>>({
        resolver: zodResolver(VariantSchema),
        defaultValues: {
            tags: [],
            variantImages: [],
            color: '#000000',
            editMode,
            id: undefined,
            productID,
            productType: 'Black Notebook',
        },
    });

    const setEdit = () => {
        if (!editMode) {
            form.reset();
            return;
        }
        if (editMode && variant) {
            form.setValue('editMode', true);
            form.setValue('id', variant.id);
            form.setValue('productID', variant.productID);
            form.setValue('productType', variant.productType);
            form.setValue(
                'tags',
                variant.variantTags.map((tag) => tag.tag)
            );
            form.setValue(
                'variantImages',
                variant.variantImages.map((img) => ({
                    name: img.name,
                    size: img.size,
                    url: img.url,
                }))
            );
        }
    };

    useEffect(() => {
        setEdit();
    }, []);

    const { execute, status } = useAction(createVariant, {
        onExecute() {
            toast.loading('Creating variant', { duration: 500 });
        },
        onSuccess(data) {
            if (data?.error) {
                toast.error(data.error);
            }
            if (data?.success) {
                toast.success(data.success);
            }
        },
    });
    function onSubmit(values: z.infer<typeof VariantSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        execute(values);
    }
    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[860px] rounded-md">
                <DialogHeader>
                    <DialogTitle>
                        {editMode ? 'Edit' : 'Create'} your variant
                    </DialogTitle>
                    <DialogDescription>
                        Manage your product variants here. You can add tags,
                        images, and more
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="productType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Pick a title for your variant"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Color</FormLabel>
                                    <FormControl>
                                        <Input type="color" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Tags</FormLabel>
                                    <FormControl>
                                        <InputTags
                                            {...field}
                                            onChange={(e) => field.onChange(e)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <VariantImages />
                        {editMode && variant && (
                            <Button
                                type="button"
                                onClick={(e) => e.preventDefault()}
                            >
                                Delete Variant
                            </Button>
                        )}
                        <Button type="submit">
                            {editMode ? 'Update Variant' : 'Create Variant'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ProductVariant;
