'use server';

import { NewPasswordSchema } from '@/types/new-password-schema';
import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '..';
import { passwordResetTokens, users } from '../schema';
import { getPasswordResetTokenByToken } from './tokens';

const action = createSafeActionClient();

export const newPassword = action(
    NewPasswordSchema,
    async ({ password, token }) => {
        const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
        const dbPool = drizzle(pool);

        if (!token) {
            return { error: 'Missing Token' };
        }

        const existingToken = await getPasswordResetTokenByToken(token);

        if (!existingToken) {
            return { error: 'Token not found' };
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) {
            return { error: 'Token has expired' };
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, existingToken.email),
        });

        if (!existingUser) {
            return { error: 'User not found' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await dbPool.transaction(async (tx) => {
            await tx
                .update(users)
                .set({
                    password: hashedPassword,
                })
                .where(eq(users.id, existingUser.id));
            await tx
                .delete(passwordResetTokens)
                .where(eq(passwordResetTokens.id, existingUser.id));
        });
        return { success: 'Password updated' };
    }
);
