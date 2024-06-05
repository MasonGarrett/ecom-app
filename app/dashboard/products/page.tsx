import placeholder from '@/public/placeholder_small.jpg';
import { db } from '@/server';
import { columns } from './columns';
import { DataTable } from './data-table';

const ProductsPage = async () => {
    const products = await db.query.products.findMany({
        orderBy: (products, { desc }) => [desc(products.id)],
    });
    if (!products) throw new Error('No products found');

    const dataTable = products.map((product) => {
        return {
            id: product.id,
            title: product.title,
            price: product.price,
            variants: [],
            image: placeholder.src,
        };
    });
    if (!dataTable) throw new Error('No data found');

    return (
        <div>
            <DataTable columns={columns} data={dataTable} />
        </div>
    );
};

export default ProductsPage;
