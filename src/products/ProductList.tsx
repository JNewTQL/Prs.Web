import ProductCard from "./ProductCard";
import type { IProduct } from "./IProduct";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface IProductListProps {
  products: IProduct[];
  loading: boolean;
}

function ProductList({ products, loading }: IProductListProps) {
  const productCardSkeletons = Array.from(Array(12), (_value, index) => <ProductCardSkeleton key={index} />);

  return (
    <section className="list d-flex flex-row flex-wrap bg-light gap-5 p-4 rounded-4">
      {loading && productCardSkeletons}
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}

export default ProductList;
