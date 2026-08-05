import { useEffect, useState } from "react";
import type { IProduct } from "./IProduct";
import { productAPI } from "./ProductAPI";
import { Link } from "react-router-dom";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import toast from "react-hot-toast";
import ProductList from "./ProductList";

function ProductsPage() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);

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
      </div>
      <ProductList products={products} loading={loading} onRemove={removeProduct} />
    </section>
  );
}

export default ProductsPage;
