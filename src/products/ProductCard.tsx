import { productAPI } from "./ProductAPI";
import toast from "react-hot-toast";
import { IProduct } from "./IProduct";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IProductCardProps {
  product: IProduct;
}

function ProductCard({ product }: IProductCardProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: productAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Successfully deleted.");
    },
  });

  return (
    <div className="card p-4" style={{ width: "23rem" }}>
      <div className="progress">
        <div className="progress-bar bg-primary-subtle" role="progressbar" style={{ width: "30%" }} />
      </div>

      <div className="d-flex justify-content-between align-items-start mt-3">
        <span className="fs-4 fw-bolder">{product.name}</span>

        <Dropdown>
          <Dropdown.Toggle className="btn btn-light d-flex border-0" style={{ background: "none" }}>
            <svg className="bi pe-none" width={20} height={20} fill="#007aff">
              <use xlinkHref={`${bootstrapIcons}#three-dots-vertical`} />
            </svg>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to={`/products/edit/${product.id}`}>
              Edit
            </Dropdown.Item>
            <Dropdown.Item
              as="a"
              href="#"
              onClick={(event) => {
                event.preventDefault();
                if (confirm("Are you sure you want to delete this product?") && product.id) {
                  deleteMutation.mutate(product.id);
                }
              }}
            >
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="d-flex align-items-baseline">
        <span className="fs-5">${product.price} </span>
        <span className="text-muted mx-1">/{product.unit.toLowerCase()}</span>
      </div>
      <div className="mt-5 mb-3">
        <span className="text-muted mx-1">{product.vendor?.name}</span>
        <br />
        <span className="badge text-secondary bg-primary-subtle">{product.partNumber}</span>
      </div>
    </div>
  );
}

export default ProductCard;
