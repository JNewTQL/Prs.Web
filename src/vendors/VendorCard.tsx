import { Dropdown } from "react-bootstrap";
import type { IVendor } from "./IVendor";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import { vendorAPI } from "./VendorAPI";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { formatPhoneNumber } from "../utility/formatUtilities";

interface IVendorCardProps {
  vendor: IVendor;
  onRemove: (vendor: IVendor) => void;
}

function VendorCard({ vendor, onRemove }: IVendorCardProps) {
  return (
    <div className="card p-4" style={{ width: "23rem" }}>
      <div className="progress">
        <div className="progress-bar bg-primary" role="progressbar" style={{ width: "65%" }} />
      </div>
      <Dropdown className="d-inline position-absolute top-0 end-0 m-3">
        <Dropdown.Toggle className="btn btn-light border-0" style={{ background: "none" }}>
          <svg className="bi pe-none" width={20} height={20} fill="#007aff">
            <use xlinkHref={`${bootstrapIcons}#three-dots-vertical`} />
          </svg>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to={`/vendors/edit/${vendor.id}`}>
            Edit
          </Dropdown.Item>
          <Dropdown.Item
            as="a"
            href="#"
            onClick={async (event) => {
              event.preventDefault();
              if (confirm("Delete this vendor?") && vendor.id) {
                try {
                  await vendorAPI.delete(vendor.id);
                  onRemove(vendor);
                  toast.success("Successfully deleted.");
                } catch (error: any) {
                  toast.error(error.message);
                }
              }
            }}
          >
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <span className="fs-4 fw-bolder">{vendor.name}</span>
      <span className="badge bg-secondary rounded-pill d-flex w-25 justify-content-center">{vendor.code}</span>
      <span className="mt-4 text-muted">{vendor.address}</span>
      <span className="text-muted">
        {vendor.city}, {vendor.state} {vendor.zip}
      </span>
      <span className="text-muted">{formatPhoneNumber(vendor.phone!) ?? "-"}</span>
      <span className="text-muted">{vendor.email}</span>
    </div>
  );
}

export default VendorCard;
