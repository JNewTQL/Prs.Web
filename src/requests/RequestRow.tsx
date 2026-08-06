import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import { requestAPI } from "./RequestAPI";
import type { IRequest } from "./IRequest";
import { getTextBackgroundByStatus, money } from "../utility/formatUtilities";
import toast from "react-hot-toast";

interface IRequestRowProps {
  request: IRequest;
  onRemove: (request: IRequest) => void;
}

function RequestRow({ request, onRemove }: IRequestRowProps) {
  return (
    <tr>
      <th scope="row">{request.id}</th>
      <td>{request.description}</td>
      <td className="text-body-secondary small text-wrap">{request.justification || "—"}</td>
      <td>
        <span className={`badge ${getTextBackgroundByStatus(request.status)}`}>{request.status}</span>
      </td>
      <td>{money(request.total)}</td>
      <td>
        {request.user?.firstName} {request.user?.lastName}
      </td>
      <td>{request.deliveryMode}</td>
      <td>
        <Dropdown className="d-inline">
          <Dropdown.Toggle className="btn btn-light border-0" style={{ background: "none" }}>
            <svg className="bi pe-none" width={20} height={20} fill="#007aff">
              <use xlinkHref={`${bootstrapIcons}#three-dots-vertical`} />
            </svg>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to={`/requests/detail/${request.id}`}>
              View
            </Dropdown.Item>
            <Dropdown.Item as={Link} to={`/requests/edit/${request.id}`}>
              Edit
            </Dropdown.Item>
            <Dropdown.Item
              as="a"
              href="#"
              onClick={async (event) => {
                event.preventDefault();
                if (confirm("Delete this request?") && request.id) {
                  try {
                    await requestAPI.delete(request.id);
                    onRemove(request);
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
      </td>
    </tr>
  );
}

export default RequestRow;
