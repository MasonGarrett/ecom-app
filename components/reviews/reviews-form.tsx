'use client';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { addReview } from '@/server/actions/add-review';
import { reviewSchema } from '@/types/reviews-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const ReviewsForm = () => {
    const params = useSearchParams();
    const productID = Number(params.get('productID'));

    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: '',
            productID,
        },
    });

    const { execute, status } = useAction(addReview, {
        onSuccess({ error, success }) {
            if (error) {
                toast.error(error);
            }
            if (success) {
                toast.success('Review Added 👌');
                form.reset();
            }
        },
    });

    function onSubmit(values: z.infer<typeof reviewSchema>) {
        execute({
            comment: values.comment,
            rating: values.rating,
            productID,
        });
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="w-full">
                    <Button
                        className="font-medium w-full"
                        variant={'secondary'}
                    >
                        Leave a review
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Leave your review</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="How would you describe this product?"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Leave your Rating</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="hidden"
                                            placeholder="Star Rating"
                                            {...field}
                                        />
                                    </FormControl>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((value) => {
                                            return (
                                                <motion.div
                                                    className="relative cursor-pointer"
                                                    whileTap={{ scale: 0.8 }}
                                                    whileHover={{ scale: 1.2 }}
                                                    key={value}
                                                >
                                                    <Star
                                                        key={value}
                                                        onClick={() => {
                                                            form.setValue(
                                                                'rating',
                                                                value,
                                                                {
                                                                    shouldValidate:
                                                                        true,
                                                                }
                                                            );
                                                        }}
                                                        className={cn(
                                                            'text-primary bg-transparent transition-all duration-300 ease-in-out',
                                                            form.getValues(
                                                                'rating'
                                                            ) >= value
                                                                ? 'fill-primary'
                                                                : 'fill-muted'
                                                        )}
                                                    />
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={status === 'executing'}
                            className="w-full"
                            type="submit"
                        >
                            {status === 'executing'
                                ? 'Adding Review...'
                                : 'Add Review'}
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    );
};

export default ReviewsForm;
