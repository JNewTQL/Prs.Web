import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import type { IProduct } from "./IProduct";
import { productAPI } from "./ProductAPI";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { Link } from "react-router-dom";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import toast from "react-hot-toast";

function ProductsPage() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const productCardSkeletons = Array.from(Array(12), (_value, index) => <ProductCardSkeleton key={index} />);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await productAPI.list();
      setProducts(data);
    } catch (error: any) {
      toast.error(error.message, { duration: 6000 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function removeProduct(deleted: IProduct) {
    setProducts(products.filter((product) => product.id !== deleted.id));
  }

  return (
    <section className="content container-fluid mx-5 my-2 py-4">
      <div className="d-flex justify-content-between pb-4 mb-4 border-bottom border-2">
        <h2>Products ({products.length})</h2>
        <Link to="/products/create" className="btn fs-6 btn-primary">
          <svg className="bi pe-none me-2" width={32} height={32} fill="#FFFFFF">
            <use xlinkHref={`${bootstrapIcons}#plus`} />
          </svg>
          Create A Product
        </Link>
      </div>{" "}
      <section className="list d-flex flex-row flex-wrap bg-light gap-5 p-4 rounded-4">
        {loading && productCardSkeletons}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onRemove={removeProduct} />
        ))}
      </section>
    </section>
  );
}

export default ProductsPage;
