import { productAPI } from "./ProductAPI";
import toast from "react-hot-toast";
import { IProduct } from "./IProduct";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import bootstrapIcons from "../assets/bootstrap-icons.svg";

interface IProductCardProps {
  product: IProduct;
  onRemove: (product: IProduct) => void;
}

function ProductCard({ product, onRemove }: IProductCardProps) {
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
              onClick={async (event) => {
                event.preventDefault();
                if (confirm("Are you sure you want to delete this product?") && product.id) {
                  try {
                    await productAPI.delete(product.id);
                    onRemove(product);
                    toast.success("Successfully deleted.");
                  } catch (error: any) {
                    toast.error(error.message, { duration: 6000 });
                  }
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
