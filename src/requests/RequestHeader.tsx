import type { IRequest } from "./IRequest";
import { getTextBackgroundByStatus } from "../utility/formatUtilities";

interface IRequestHeaderProps {
  request: IRequest;
}

function RequestHeader({ request }: IRequestHeaderProps) {
  return (
    <section className="d-flex flex-wrap gap-4 justify-content-between pe-5">
      <dl>
        <dt>Description</dt>
        <dd>{request.description}</dd>
        <dt>Justification</dt>
        <dd>{request.justification || "—"}</dd>
      </dl>
      <dl>
        <dt>Delivery Method</dt>
        <dd>{request.deliveryMode}</dd>
        <dt>Status</dt>
        <dd>
          <span className={`badge ${getTextBackgroundByStatus(request.status)}`}>{request.status}</span>
        </dd>
      </dl>
      <dl>
        <dt>Requested By</dt>
        <dd>
          {request.user?.firstName} {request.user?.lastName}
        </dd>
        {request.status === "REJECTED" && (
          <>
            <dt>Rejection Reason</dt>
            <dd className="text-danger">{request.rejectionReason}</dd>
          </>
        )}
      </dl>
    </section>
  );
}

export default RequestHeader;
