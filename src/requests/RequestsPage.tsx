import { useEffect, useState, SyntheticEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { IRequest } from "./IRequest";
import { requestAPI } from "./RequestAPI";
import RequestTable from "./RequestTable";
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
          <svg className="bi pe-none me-2" width={32} height={32} fill="#FFFFFF">
            <use xlinkHref={`${bootstrapIcons}#plus`} />
          </svg>
          Create A Request
        </Link>
      </div>

      <RequestTable requests={requests} loading={loading} currentStatus={searchParams.get("status") ?? ""} onStatusChange={handleStatusChange} onRemove={removeRequest} />
    </section>
  );
}

export default RequestsPage;
