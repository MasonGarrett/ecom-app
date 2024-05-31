'use server';

import { LoginSchema } from '@/types/login-schema';
import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '..';
import { signIn } from '../auth';
import { users } from '../schema';
import { sendVerificationEmail } from './email';
import { generateEmailVerificationToken } from './tokens';

const action = createSafeActionClient();

export const emailSignIn = action(
    LoginSchema,
    async ({ email, password, code }) => {
        try {
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email),
            });

            if (existingUser?.email !== email) {
                return { error: 'Email not found' };
            }

            if (!existingUser.emailVerified) {
                const verificationToken = await generateEmailVerificationToken(
                    existingUser.email
                );

                await sendVerificationEmail(
                    verificationToken[0].email,
                    verificationToken[0].token
                );

                return { success: 'Confirmation Email Sent!' };
            }

            await signIn('credentials', {
                email,
                password,
                redirectTo: '/',
            });

            return { success: email };
        } catch (error) {
            console.log(error);

            if (error instanceof AuthError) {
                switch (error.type) {
                    case 'AccessDenied':
                        return { error: error.message };
                    case 'CredentialsSignin':
                        return { error: 'Email or Password Incorrect' };
                    default: {
                        return { error: 'Something went wrong' };
                    }
                }
            }
            throw error;
        }
    }
);
