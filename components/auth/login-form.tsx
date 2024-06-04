'use client';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';
import { emailSignIn } from '@/server/actions/email-signin';
import { LoginSchema } from '@/types/login-schema';
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

const LoginForm = () => {
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showTwoFactor, setShowTwoFactor] = useState(false);

    const { execute, status, result } = useAction(emailSignIn, {
        onSuccess(data) {
            if (data?.error) setError(data.error);
            if (data?.success) setSuccess(data.success);
            if (data.twoFactor) setShowTwoFactor(true);
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
                            {showTwoFactor && (
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                We have sent you a two factor
                                                code to your email
                                            </FormLabel>
                                            <FormControl>
                                                <InputOTP
                                                    disabled={
                                                        status === 'executing'
                                                    }
                                                    {...field}
                                                    maxLength={6}
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot
                                                            index={0}
                                                        />
                                                        <InputOTPSlot
                                                            index={1}
                                                        />
                                                        <InputOTPSlot
                                                            index={2}
                                                        />
                                                        <InputOTPSlot
                                                            index={3}
                                                        />
                                                        <InputOTPSlot
                                                            index={4}
                                                        />
                                                        <InputOTPSlot
                                                            index={5}
                                                        />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormDescription />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            {!showTwoFactor && (
                                <>
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
                                </>
                            )}

                            <FormSuccess message={success} />
                            <FormError message={error} />
                            <Button
                                size={'sm'}
                                className="px-0"
                                variant={'link'}
                                asChild
                            >
                                <Link href="/auth/reset">
                                    Forgot your password
                                </Link>
                            </Button>
                        </div>

                        <Button
                            type="submit"
                            className={cn(
                                'w-full my-4',
                                status === 'executing' ? 'animate-pulse' : ''
                            )}
                        >
                            {showTwoFactor ? 'verify' : 'Sign In'}
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    );
};

export default LoginForm;
