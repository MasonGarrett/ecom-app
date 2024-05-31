'use client';
import { cn } from '@/lib/utils';
import { emailRegister } from '@/server/actions/email-register';
import { RegisterSchema } from '@/types/register-schema';
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

const RegisterForm = () => {
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { execute, status } = useAction(emailRegister, {
        onSuccess(data) {
            if (data.error) setError(data.error);
            if (data.success) setSuccess(data.success);
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        execute(values);
    };
    return (
        <AuthCard
            cardTitle="Create an account 🎉"
            backButtonHref="/auth/login"
            backButtonLabel="Already have an account?"
            showSocials
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="mgarrett"
                                                type="text"
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                            {'Register'}
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    );
};

export default RegisterForm;
