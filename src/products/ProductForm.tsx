import { useNavigate, useParams } from "react-router-dom";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { IProduct } from "./IProduct";
import { productAPI } from "./ProductAPI";
import { vendorAPI } from "../vendors/VendorAPI";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const { data: vendors = [], isLoading: vendorsLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: vendorAPI.list,
  });

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["products", Number(id)],
    queryFn: () => productAPI.find(Number(id)),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProduct>({
    values: product ?? emptyProduct,
  });

  const saveMutation = useMutation({
    mutationFn: async (productToSave: IProduct) => {
      productToSave.vendorId = Number(productToSave.vendorId);
      delete productToSave.vendor;

      if (productToSave.id) {
        return await productAPI.put(productToSave);
      } else {
        return await productAPI.post(productToSave);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Successfully saved.");
      navigate("/products");
    },
  });

  const save: SubmitHandler<IProduct> = (productToSave) => {
    saveMutation.mutate(productToSave);
  };

  if (vendorsLoading || productLoading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

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
        <button type="submit" className="btn btn-primary px-4 d-flex align-items-center gap-2" disabled={saveMutation.isPending}>
          <svg className="bi pe-none" width={16} height={16} fill="#FFFFFF">
            <use xlinkHref={`${bootstrapIcons}#save`} />
          </svg>
          {saveMutation.isPending ? "Saving..." : "Save product"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
