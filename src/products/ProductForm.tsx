import { useNavigate, useParams } from "react-router-dom";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { IProduct } from "./IProduct";
import { IVendor } from "../vendors/IVendor";
import { productAPI } from "./ProductAPI";
import { vendorAPI } from "../vendors/VendorAPI";
import toast from "react-hot-toast";

const emptyProduct: IProduct = {
  id: undefined,
  name: "",
  partNumber: "",
  price: "",
  unit: "",
  vendorId: undefined,
  vendor: undefined,
};

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [vendors, setVendors] = useState<IVendor[]>([]);

  async function loadVendors() {
    setVendors(await vendorAPI.list());
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IProduct>({
    defaultValues: async () => {
      await loadVendors();
      if (!id) return emptyProduct;
      return await productAPI.find(Number(id));
    },
  });

  const save: SubmitHandler<IProduct> = async (product) => {
    try {
      product.vendorId = Number(product.vendorId);
      delete product.vendor;
      if (!product.id) await productAPI.post(product);
      else await productAPI.put(product);
    } catch (error: any) {
      toast.error(error.message, { duration: 6000 });
      return;
    }
    toast.success("Successfully saved.");
    navigate("/products");
  };

  return (
    <form className="w-100" onSubmit={handleSubmit(save)} noValidate>
      <div className="d-flex gap-3 mb-3">
        <div className="w-25">
          <label htmlFor="number" className="form-label text-muted">
            Product Number
          </label>
          <input
            id="number"
            type="text"
            maxLength={20}
            placeholder="Enter product number"
            className={`form-control ${errors?.partNumber ? "is-invalid" : ""}`}
            {...register("partNumber", {
              required: "Product Number is required.",
              maxLength: {
                value: 20,
                message: "Product Number cannot exceed 20 characters.",
              },
            })}
          />
          <div className="invalid-feedback">{errors?.partNumber?.message}</div>
        </div>

        <div className="w-75">
          <label htmlFor="name" className="form-label text-muted">
            Product Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter product name"
            className={`form-control ${errors?.name ? "is-invalid" : ""}`}
            {...register("name", { required: "Product Name is required." })}
          />
          <div className="invalid-feedback">{errors?.name?.message}</div>
        </div>
      </div>
      <div className="d-flex gap-3 mb-5">
        <div className="w-25">
          <label htmlFor="price" className="form-label text-muted">
            Price
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            placeholder="Enter product's price"
            className={`form-control ${errors?.price ? "is-invalid" : ""}`}
            {...register("price", {
              valueAsNumber: true,
              required: "Price is required.",
            })}
          />
          <div className="invalid-feedback">{errors?.price?.message}</div>
        </div>

        <div className="w-25">
          <label htmlFor="unit" className="form-label text-muted">
            Unit
          </label>
          <input id="unit" type="text" placeholder="Enter unit" className={`form-control ${errors?.unit ? "is-invalid" : ""}`} {...register("unit", { required: "Unit is required." })} />
          <div className="invalid-feedback">{errors?.unit?.message}</div>
        </div>

        <div className="w-50">
          <label htmlFor="vendorId" className="form-label text-muted">
            Vendor
          </label>
          <select
            id="vendorId"
            className={`form-select ${errors?.vendorId ? "is-invalid" : ""}`}
            {...register("vendorId", {
              valueAsNumber: true,
              required: "Vendor is required.",
            })}
          >
            <option value="">Select Vendor...</option>
            {vendors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{errors?.vendorId?.message}</div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-2">
        <button type="button" className="btn btn-outline-primary px-4" onClick={() => navigate("/products")}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary px-4 d-flex align-items-center gap-2" disabled={isSubmitting}>
          <svg className="bi pe-none" width={16} height={16} fill="#FFFFFF">
            <use xlinkHref={`${bootstrapIcons}#save`} />
          </svg>
          {isSubmitting ? "Saving..." : "Save product"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
