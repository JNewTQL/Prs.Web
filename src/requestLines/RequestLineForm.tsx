import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { IRequestLine } from "./IRequestLine";
import type { IProduct } from "../products/IProduct";
import { productAPI } from "../products/ProductAPI";
import { requestLineAPI } from "./RequestLineAPI";

function RequestLineForm() {
  let { lineId, id } = useParams<{ lineId: string; id: string }>();
  const requestLineId = Number(lineId);
  const requestId = Number(id);
  const navigate = useNavigate();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(undefined);

  let emptyRequestLine: IRequestLine = {
    id: undefined,
    quantity: 0,
    requestId: requestId,
    productId: 0,
    product: undefined,
    request: undefined,
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IRequestLine>({
    defaultValues: async () => {
      await loadProducts();
      if (!lineId) {
        return Promise.resolve(emptyRequestLine);
      } else {
        const requestLine = await requestLineAPI.find(requestLineId);
        return Promise.resolve(requestLine);
      }
    },
  });

  async function loadProducts() {
    const data = await productAPI.list();
    setProducts(data);
  }

  let productId = watch("productId");
  let quantity = watch("quantity");

  useEffect(() => {
    let currentProduct = products.find((p) => p?.id === productId);
    setSelectedProduct(currentProduct);
  }, [productId, products]);

  const save: SubmitHandler<IRequestLine> = async (requestLine) => {
    try {
      if (!requestLine.id) {
        requestLine = await requestLineAPI.post(requestLine);
      } else {
        await requestLineAPI.put(requestLine);
      }
      toast.success("Successfully saved.");
      navigate(`/requests/detail/${requestLine.requestId}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const productPrice = Number(selectedProduct?.price ?? 0);
  const totalAmount = productPrice * quantity;

  return (
    <form className="form w-50" onSubmit={handleSubmit(save)}>
      <div className="card p-4">
        <h5 className="card-title">
          <strong>Item</strong>
        </h5>

        <div className="mb-3">
          <label htmlFor="productId" className="form-label">
            Product
          </label>
          <select {...register("productId", { valueAsNumber: true, required: "Product is required" })} className={`form-select ${errors?.productId && "is-invalid"}`}>
            <option value="0">Select…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{errors?.productId?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <div className="form-label">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(productPrice)}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            {...register("quantity", {
              required: "Quantity is required",
              min: { value: 1, message: "Quantity must be at least 1" },
              valueAsNumber: true,
            })}
            className={`form-control ${errors?.quantity && "is-invalid"}`}
          />
          <div className="invalid-feedback">{errors?.quantity?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Amount</label>
          <div className="form-label">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalAmount)}</div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <Link to={`/requests/detail/${requestId}`} className="btn btn-outline-primary me-2">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Save item
          </button>
        </div>
      </div>
    </form>
  );
}

export default RequestLineForm;
