import { Dropdown } from "react-bootstrap";
import { formatPhoneNumber } from "../utility/formatUtilities";
import type { IUser } from "./IUser";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import { userAPI } from "./UserAPI";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

interface IUserCardProps {
  user: IUser;
  onRemove: (user: IUser) => void;
}

const getRoleLabel = (user: IUser) => {
  if (user.isAdmin) {
    return <span className="badge text-bg-dark mt-1">Admin</span>;
  }

  if (user.isReviewer) {
    return <span className="badge text-bg-primary mt-1">Reviewer</span>;
  }

  return <span className="text-muted fst-italic small mt-1">no role assigned</span>;
};

function UserCard({ user, onRemove }: IUserCardProps) {
  return (
    <div className="card p-4" style={{ width: "23rem" }}>
      <Dropdown className="d-inline position-absolute top-0 end-0 m-3">
        <Dropdown.Toggle className="btn btn-light border-0" style={{ background: "none" }}>
          <svg className="bi pe-none" width={20} height={20} fill="#ff9100">
            <use xlinkHref={`${bootstrapIcons}#three-dots-vertical`} />
          </svg>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to={`/user/edit/${user.id}`}>
            Edit
          </Dropdown.Item>
          <Dropdown.Item
            as="a"
            href="#"
            onClick={async (event) => {
              event.preventDefault();
              if (confirm("Delete this user?") && user.id) {
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
      <span className="fs-4 fw-bolder">
        {user.firstName} {user.lastName}
      </span>
      <span className="fs-6 fw-light">{user.username}</span>
      <span className="fs-6 fw-light">{formatPhoneNumber(user.phone) || "—"}</span>
      <span className="fs-6 fw-light">{user.email || "—"}</span>

      <div>{getRoleLabel(user)}</div>
    </div>
  );
}

export default UserCard;
