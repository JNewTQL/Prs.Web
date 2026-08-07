import type { IRequest } from "./IRequest";
import RequestRow from "./RequestRow";

interface RequestTableProps {
  requests: IRequest[];
  loading: boolean;
  currentStatus: string;
  onStatusChange: (event: any) => void;
  onRemove: (request: IRequest) => void;
}

function RequestTable({ requests, loading, currentStatus, onStatusChange, onRemove }: RequestTableProps) {
  return (
    <section className="list bg-body-tertiary p-4 rounded-4">
      <select id="status" className="form-select w-25 mb-3" value={currentStatus} onChange={onStatusChange}>
        <option value="">All</option>
        <option value="NEW">New</option>
        <option value="REVIEW">Review</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>

      {loading && <p className="text-muted">Loading requests...</p>}

      {!loading && (
        <table className="table table-hover w-75 rounded-4">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Description</th>
              <th scope="col">Status</th>
              <th scope="col">Total</th>
              <th scope="col">Requested By</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <RequestRow key={request.id} request={request} onRemove={onRemove} />
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default RequestTable;
