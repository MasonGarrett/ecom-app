import { auth } from '@/server/auth';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import CartDrawer from '../cart/cart-drawer';
import { Button } from '../ui/button';
import Logo from './logo';
import UserButton from './user-button';

const Nav = async () => {
    const session = await auth();
    return (
        <header className="py-8">
            <ul className="flex justify-between items-center md:gap-8 gap-4">
                <li className="flex flex-1">
                    <Link href={'/'} aria-label="Logo">
                        <Logo />
                    </Link>
                </li>
                <li className="realitve flex items-center hover:bg-muted">
                    <CartDrawer />
                </li>
                {!session ? (
                    <li className="flex items-center justify-center">
                        <Button asChild>
                            <Link className="flex gap-2" href={'/auth/login'}>
                                <LogIn size={16} />
                                <span>Login</span>
                            </Link>
                        </Button>
                    </li>
                ) : (
                    <li className="flex items-center justify-center">
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
