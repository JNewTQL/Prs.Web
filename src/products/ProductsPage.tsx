import { useState } from "react";
import type { IProduct } from "./IProduct";
import { productAPI } from "./ProductAPI";
import { Link } from "react-router-dom";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import ProductList from "./ProductList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const PAGE_SIZE = 12;

function ProductsPage() {
  const [page, setPage] = useState(1);

  const { data, isPending, isPlaceholderData } = useQuery({
    queryKey: ["products", { page }],
    queryFn: () => productAPI.listPaged(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });

  const products = data?.items ?? [];
  const totalPages = Math.ceil((data?.totalCount ?? 0) / PAGE_SIZE);
  const totalCount = data?.totalCount ?? 0;

  return (
    <section className="content container-fluid mx-5 my-2 py-4">
      <div className="d-flex justify-content-between pb-4 mb-4 border-bottom border-2">
        <h2>Products ({totalCount})</h2>
        <Link to="/products/create" className="btn fs-6 btn-primary">
          <svg className="bi pe-none me-2" width={32} height={32} fill="#FFFFFF">
            <use xlinkHref={`${bootstrapIcons}#plus`} />
          </svg>
          Create A Product
        </Link>
      </div>

      <ProductList products={products} loading={isPending} />
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button className="btn btn-outline-primary" onClick={() => setPage((currentPage) => currentPage - 1)} disabled={page === 1}>
            Previous
          </button>
          <span className="text-secondary fw-medium">
            Page {page} of {totalPages}
          </span>
          <button className="btn btn-outline-primary" onClick={() => setPage((currentPage) => currentPage + 1)} disabled={isPlaceholderData || page === totalPages}>
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default ProductsPage;
