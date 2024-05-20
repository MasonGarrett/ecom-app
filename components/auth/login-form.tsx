'use client';
import { cn } from '@/lib/utils';
import { emailSignIn } from '@/server/actions/email-signin';
import { LoginSchema } from '@/types/login-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

const LoginForm = () => {
    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const [error, setError] = useState('');

    const { execute, status, result } = useAction(emailSignIn, {
        onSuccess(data) {
            console.log(data);
        },
    });

    const onSubmit = (values: Zod.infer<typeof LoginSchema>) => {
        execute(values);
    };
    return (
        <AuthCard
            cardTitle="Welcome back!"
            backButtonHref="/auth/register"
            backButtonLabel="Create a new account"
            showSocials
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
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
                                                autoComplete="email"
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button size={'sm'} variant={'link'} asChild>
                            <Link href="/auth/reset">Forgot your password</Link>
                        </Button>
                        <Button
                            type="submit"
                            className={cn(
                                'w-full',
                                status === 'executing' ? 'animate-pulse' : ''
                            )}
                        >
                            {'Login'}
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    );
};

export default LoginForm;