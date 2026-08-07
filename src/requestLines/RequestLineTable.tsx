import { Link } from "react-router-dom";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import { money } from "../utility/formatUtilities";
import type { IRequest } from "../requests/IRequest";
import type { IRequestLine } from "../requestLines/IRequestLine";

interface RequestLineTableProps {
  request: IRequest;
  onDeleteClick: (line: IRequestLine) => void;
}

function RequestLineTable({ request, onDeleteClick }: RequestLineTableProps) {
  return (
    <div className="card p-4 mt-5">
      <h5 className="card-title mb-4">Items</h5>
      <table className="table w-75 align-middle">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {request.requestLines?.map((line) => (
            <tr key={line.id}>
              <td>{line.product?.name}</td>
              <td>{money(Number(line.product?.price ?? 0))}</td>
              <td>{line.quantity}</td>
              <td>{money(Number(line.product?.price ?? 0) * line.quantity)}</td>
              <td>
                <div className="d-flex gap-3">
                  <Link to={`/requests/detail/${request.id}/requestlines/edit/${line.id}`} className="text-primary text-decoration-none">
                    <svg width={16} height={16} fill="currentColor">
                      <use xlinkHref={`${bootstrapIcons}#pencil`} />
                    </svg>
                  </Link>
                  <button type="button" className="btn btn-link text-primary p-0 text-decoration-none" onClick={() => onDeleteClick(line)}>
                    <svg width={16} height={16} fill="currentColor">
                      <use xlinkHref={`${bootstrapIcons}#trash`} />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Link to={`/requests/detail/${request.id}/requestlines/create`} className="btn btn-outline-primary d-inline-flex align-items-center gap-2">
                <svg width={18} height={18} fill="currentColor">
                  <use xlinkHref={`${bootstrapIcons}#plus-circle`} />
                </svg>
                Add a line
              </Link>
            </td>
            <td />
            <td className="fw-bold text-end">Total:</td>
            <td>{money(request.total)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default RequestLineTable;
