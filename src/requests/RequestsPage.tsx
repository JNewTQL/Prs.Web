import { useEffect, useState, SyntheticEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { IRequest } from "./IRequest";
import { requestAPI } from "./RequestAPI";
import RequestRow from "./RequestRow";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import toast from "react-hot-toast";

function RequestsPage() {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  async function loadRequests() {
    setLoading(true);
    try {
      const data = await requestAPI.list(searchParams.get("status") ?? undefined);
      setRequests(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  function removeRequest(request: IRequest) {
    setRequests(requests.filter((o) => o.id !== request.id));
  }

  useEffect(() => {
    loadRequests();
  }, [searchParams.get("status")]);

  function handleStatusChange(event: SyntheticEvent) {
    setSearchParams({ status: (event.target as HTMLSelectElement).value });
  }

  return (
    <section className="content container-fluid mx-5 my-2 py-4">
      <div className="d-flex justify-content-between align-items-center pb-4 mb-4 border-bottom border-2">
        <h2 className="border-2">Requests ({requests.length})</h2>
        <Link to="/requests/create" className="btn btn-primary">
          <svg className="bi pe-none me-2" width={20} height={20} fill="#FFFFFF">
            <use xlinkHref={`${bootstrapIcons}#plus`} />
          </svg>
          Add Request
        </Link>
      </div>

      <section className="list bg-body-tertiary p-4 rounded-4">
        <select id="status" className="form-select w-auto mb-3" value={searchParams.get("status") ?? ""} onChange={handleStatusChange}>
          <option value="">All</option>
          <option value="NEW">New</option>
          <option value="REVIEW">Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        {loading && <p className="text-muted">Loading requests...</p>}

        {!loading && (
          <table className="table table-hover w-100 rounded-4">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Description</th>
                <th scope="col">Justification</th>
                <th scope="col">Status</th>
                <th scope="col">Total</th>
                <th scope="col">Requested By</th>
                <th scope="col">Delivery Mode</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <RequestRow key={request.id} request={request} onRemove={removeRequest} />
              ))}
            </tbody>
          </table>
        )}
      </section>
    </section>
  );
}

export default RequestsPage;
