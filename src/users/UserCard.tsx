import { Dropdown } from "react-bootstrap";
import type { IUser } from "./IUser";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import { userAPI } from "./UserAPI";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { formatPhoneNumber } from "../utility/formatUtilities"; // ✨ Our shiny new import!

interface IUserCardProps {
  user: IUser;
  onRemove: (user: IUser) => void;
}

const getRoleLabel = (user: IUser) => {
  if (user.isAdmin) {
    return <span className="text-muted mt-1">Admin</span>;
  }

  if (user.isReviewer) {
    return <span className="text-muted mt-1">Reviewer</span>;
  }

  return <span className="text-muted mt-1">no role assigned</span>;
};

function UserCard({ user, onRemove }: IUserCardProps) {
  const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase();

  return (
    <div className="p-4 position-relative border-0" style={{ width: "23rem" }}>
      <Dropdown className="d-inline position-absolute top-0 end-0 m-3">
        <Dropdown.Toggle className="btn btn-light border-0 shadow-none" style={{ background: "none" }}>
          <svg className="bi pe-none" width={20} height={20} fill="#007aff">
            <use xlinkHref={`${bootstrapIcons}#three-dots-vertical`} />
          </svg>
        </Dropdown.Toggle>
        <Dropdown.Menu className="shadow-sm">
          <Dropdown.Item as={Link} to={`/users/edit/${user.id}`}>
            Edit
          </Dropdown.Item>
          <Dropdown.Item
            as="a"
            href="#"
            onClick={async (event) => {
              event.preventDefault();
              if (confirm(`Delete user ${user.firstName} ${user.lastName}?`) && user.id) {
                try {
                  await userAPI.delete(user.id);
                  onRemove(user);
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

      <div className="d-flex align-items-center gap-3">
        <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0 fs-6" style={{ width: "56px", height: "56px" }}>
          {initials}
        </div>

        <div className="d-flex flex-column overflow-hidden">
          <span className="fs-5 fw-bolder text-truncate">
            {user.firstName} {user.lastName}
          </span>

          <div>{getRoleLabel(user)}</div>
          <span className="fs-6 text-muted">{formatPhoneNumber(user.phone)}</span>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
