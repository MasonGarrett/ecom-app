'use server';

import { SettingsSchema } from '@/types/settings-schema';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';
import { db } from '..';
import { auth } from '../auth';
import { users } from '../schema';

const action = createSafeActionClient();

export const settings = action(SettingsSchema, async (values) => {
    const user = await auth();

    if (!user) {
        return { error: 'user not found' };
    }

    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.user.id),
    });

    if (!dbUser) {
        return { error: 'user not found' };
    }

    if (user.user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if (values.password && values.newPassword && dbUser.password) {
        const passwordMatch = await bcrypt.compare(
            values.password,
            dbUser.password
        );

        if (!passwordMatch) {
            return { error: 'password does not match' };
        }

        const samePassword = await bcrypt.compare(
            values.newPassword,
            dbUser.password
        );

        if (samePassword) {
            return { error: 'New password is the same as the old password' };
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10);
        values.password = hashedPassword;
        values.newPassword = undefined;
    }

    const updatedUser = await db
        .update(users)
        .set({
            name: values.name,
            password: values.password,
            twoFactorEnabled: values.isTwoFactorEnabled,
            email: values.email,
            image: values.image,
        })
        .where(eq(users.id, dbUser.id));
    revalidatePath('/dashboard/settings');
    return { success: 'Settings updated' };
});
