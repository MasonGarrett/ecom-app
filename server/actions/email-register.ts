'use server';

import { RegisterSchema } from '@/types/register-schema';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '..';
import { users } from '../schema';
import { sendVerificationEmail } from './email';
import { generateEmailVerificationToken } from './tokens';

const action = createSafeActionClient();
export const emailRegister = action(
    RegisterSchema,
    async ({ name, email, password }) => {
        // Hashing out passwords
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check existing user
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            if (!existingUser.emailVerified) {
                const verificationToken = await generateEmailVerificationToken(
                    email
                );

                await sendVerificationEmail(
                    verificationToken[0].email,
                    verificationToken[0].token
                );

                return { success: 'Email Confirmation resent' };
            }
            return { error: 'Email already in use' };
        }

        // Logic for when user is not registered
        await db.insert(users).values({
            email,
            name,
            password: hashedPassword,
        });

        const verificationToken = await generateEmailVerificationToken(email);

        await sendVerificationEmail(
            verificationToken[0].email,
            verificationToken[0].token
        );

        return { success: 'Confirmation email sent!' };
    }
);
