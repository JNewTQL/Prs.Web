import type { IProduct } from "./IProduct";
import { productAPI } from "./ProductAPI";
import { Link } from "react-router-dom";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import ProductList from "./ProductList";
import { useQuery } from "@tanstack/react-query";

function ProductsPage() {
  const { data: products = [], isPending } = useQuery({
    queryKey: ["products"],
    queryFn: productAPI.list,
  });

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

      <ProductList products={products} loading={isPending} />
    </section>
  );
}

export default ProductsPage;
