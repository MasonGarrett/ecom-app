'use client';

import { useCartStore } from '@/lib/cart-store';
import formatPrice from '@/lib/format-price';
import emptyCart from '@/public/empty-box.json';
import { createId } from '@paralleldrive/cuid2';
import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { MinusCircle, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';
import { Button } from '../ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from '../ui/table';

const CartItems = () => {
    const { cart, addToCart, removeFromCart, setCheckoutProgress } =
        useCartStore();

    const totalPrice = useMemo(() => {
        return cart.reduce((acc, item) => {
            return acc + item.price! * item.variant.quantity;
        }, 0);
    }, [cart]);

    const priceInCharacters = useMemo(() => {
        return [...totalPrice.toFixed(2).toString()].map((character) => {
            return { character, id: createId() };
        });
    }, [totalPrice]);
    return (
        <motion.div className="flex flex-col items-center">
            {cart.length === 0 && (
                <div className="flex-col w-full flex items-center justify-center">
                    <motion.div
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <h2 className="text-2xl text-muted-foreground text-center">
                            Your cart is empty
                        </h2>
                        <Lottie className="h-64" animationData={emptyCart} />
                    </motion.div>
                </div>
            )}
            {cart.length > 0 && (
                <div className="h-88 w-full overflow-y-auto">
                    <Table className="max-w-2xl mx-auto">
                        <TableHeader>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Quantity</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>
                                        {formatPrice(item.price)}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <Image
                                                className="rounded-md"
                                                width={48}
                                                height={48}
                                                src={item.image}
                                                alt={item.name}
                                                priority
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-between gap-2">
                                            <MinusCircle
                                                onClick={() => {
                                                    removeFromCart({
                                                        ...item,
                                                        variant: {
                                                            quantity: 1,
                                                            variantID:
                                                                item.variant
                                                                    .variantID,
                                                        },
                                                    });
                                                }}
                                                className="cursor-point hover:text-muted-foreground duration-300 transition-colors"
                                                scale={14}
                                            />
                                            <p className="text-md font-bold">
                                                {item.variant.quantity}
                                            </p>
                                            <PlusCircle
                                                className="cursor-point hover:text-muted-foreground duration-300 transition-colors"
                                                onClick={() => {
                                                    addToCart({
                                                        ...item,
                                                        variant: {
                                                            quantity: 1,
                                                            variantID:
                                                                item.variant
                                                                    .variantID,
                                                        },
                                                    });
                                                }}
                                                scale={14}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            <motion.div className="flex items-ceter justify-center relative overflow-hidden my-4">
                <span className="text-md">Total: $</span>
                <AnimatePresence mode="popLayout">
                    {priceInCharacters.map((character, i) => (
                        <motion.span
                            key={character.id}
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            exit={{ y: -20 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-md inline-block"
                        >
                            {character.character}
                        </motion.span>
                    ))}
                </AnimatePresence>
            </motion.div>
            <Button
                onClick={() => {
                    setCheckoutProgress('payment-page');
                }}
                className="max-w-md w-full"
                disabled={cart.length === 0}
            >
                Checkout
            </Button>
        </motion.div>
    );
};

export default CartItems;
