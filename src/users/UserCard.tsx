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

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
};

const getRoleLabel = (user: IUser) => {
  if (user.isAdmin) {
    return <span className="text-muted small">Admin</span>;
  }

  if (user.isReviewer) {
    return <span className="text-muted small">Reviewer</span>;
  }

  return <span className="text-muted small">no role assigned</span>;
};

function UserCard({ user, onRemove }: IUserCardProps) {
  return (
    <div className="d-flex align-items-center mb-4">
      <div
        className="d-flex align-items-center justify-content-center rounded-circle text-white me-4"
        style={{
          width: "75px",
          height: "75px",
          backgroundColor: "#6c757d",
          fontSize: "1.5rem",
        }}
      >
        {getInitials(user.firstName, user.lastName)}
      </div>

      <div className="d-flex flex-column">
        <div className="d-flex align-items-center">
          <span className="fs-5 fw-bold">
            {user.firstName} {user.lastName}
          </span>

          <Dropdown className="d-inline ms-2">
            <Dropdown.Toggle className="btn btn-light border-0" style={{ background: "none" }}>
              <svg className="bi pe-none" width={20} height={20} fill="#007aff">
                <use xlinkHref={`${bootstrapIcons}#three-dots-vertical`} />
              </svg>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to={`/users/edit/${user.id}`}>
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
        </div>

        {getRoleLabel(user)}
        <span className="text-muted small">{formatPhoneNumber(user.phone) || "—"}</span>
      </div>
    </div>
  );
}

export default UserCard;
