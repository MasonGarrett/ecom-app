import { auth } from '@/server/auth';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import Logo from './logo';
import UserButton from './user-button';

const Nav = async () => {
    const session = await auth();
    return (
        <header className="py-8">
            <ul className="flex justify-between">
                <li>
                    <Link href={'/'}>
                        <Logo />
                    </Link>
                </li>
                {!session ? (
                    <li>
                        <Button asChild>
                            <Link className="flex gap-2" href={'/auth/login'}>
                                <LogIn size={16} />
                                <span>Login</span>
                            </Link>
                        </Button>
                    </li>
                ) : (
                    <li>
                        <UserButton
                            expires={session?.expires}
                            user={session?.user}
                        />
                    </li>
                )}
            </ul>
        </header>
    );
};

export default Nav;
