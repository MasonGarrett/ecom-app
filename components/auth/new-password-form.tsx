'use client';
import { cn } from '@/lib/utils';
import { newPassword } from '@/server/actions/new-password';
import { NewPasswordSchema } from '@/types/new-password-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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

const NewPasswordForm = () => {
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: '',
        },
    });
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { execute, status } = useAction(newPassword, {
        onSuccess(data) {
            if (data?.error) setError(data.error);
            if (data?.success) setSuccess(data.success);
        },
    });

    const onSubmit = (values: Zod.infer<typeof NewPasswordSchema>) => {
        execute({ password: values.password, token });
    };
    return (
        <AuthCard
            cardTitle="Enter a new password"
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="********"
                                                type="password"
                                                autoComplete="current-password"
                                                disabled={
                                                    status === 'executing'
                                                }
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

export default NewPasswordForm;
