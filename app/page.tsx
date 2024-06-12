import Products from '@/components/products/products';
import { db } from '@/server';

export default async function Home() {
    const data = await db.query.productVariants.findMany({
        with: {
            variantImages: true,
            variantTags: true,
            product: true,
        },
        orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
    });
    return (
        <main className="">
            <h1>Homepage</h1>
            <Products variants={data} />
        </main>
    );
}
