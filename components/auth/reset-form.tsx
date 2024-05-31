'use client';
import { cn } from '@/lib/utils';
import { reset } from '@/server/actions/password-reset';
import { ResetSchema } from '@/types/reset-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import AuthCard from './auth-card';
import FormError from './form-error';
import FormSuccess from './form-success';

const ResetForm = () => {
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {},
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { execute, status } = useAction(reset, {
        onSuccess(data) {
            if (data?.error) setError(data.error);
            if (data?.success) setSuccess(data.success);
        },
    });

    const onSubmit = (values: Zod.infer<typeof ResetSchema>) => {
        execute(values);
    };
    return (
        <AuthCard
            cardTitle="Forgot your password?"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
            showSocials
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            {' '}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="email@domain.com"
                                                type="email"
                                                disabled={
                                                    status === 'executing'
                                                }
                                                autoComplete="email"
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormSuccess message={success} />
                            <FormError message={error} />
                            <Button size={'sm'} variant={'link'} asChild>
                                <Link href="/auth/reset">
                                    Forgot your password
                                </Link>
                            </Button>
                        </div>

                        <Button
                            type="submit"
                            className={cn(
                                'w-full',
                                status === 'executing' ? 'animate-pulse' : ''
                            )}
                        >
                            {'Reset Password'}
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    );
};

export default ResetForm;
