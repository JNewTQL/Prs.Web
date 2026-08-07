import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { IRequest } from "./IRequest";
import { requestAPI } from "./RequestAPI";
import RequestHeader from "./RequestHeader";
import RequestLineTable from "../requestLines/RequestLineTable";
import { SubmitHandler, useForm } from "react-hook-form";
import { Modal } from "react-bootstrap";
import type { IRequestLine } from "../requestLines/IRequestLine";
import { requestLineAPI } from "../requestLines/RequestLineAPI";
import { useUserContext } from "../App";
import bootstrapIcons from "../assets/bootstrap-icons.svg";

interface IRejectForm {
  rejectionReason: string | undefined;
}

function RequestDetailPage() {
  const { user } = useUserContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<IRequest | undefined>(undefined);

  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const openReject = () => setIsRejectOpen(true);
  const closeReject = () => setIsRejectOpen(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRejectForm>({
    defaultValues: async () => ({ rejectionReason: undefined }),
  });

  const saveReject: SubmitHandler<IRejectForm> = async (form) => {
    if (!request?.id || !form.rejectionReason) return;

    const updatedRequest = { ...request, rejectionReason: form.rejectionReason };
    await requestAPI.reject(updatedRequest);

    setIsRejectOpen(false);
    toast.success("Request rejected.");
    navigate("/requests");
  };

  const [lineToDelete, setLineToDelete] = useState<IRequestLine | undefined>(undefined);
  function handleShowDeleteItemModal(line: IRequestLine) {
    setLineToDelete(line);
  }
  function handleCloseDeleteItemModal() {
    setLineToDelete(undefined);
  }

  async function removeRequestLine() {
    if (!lineToDelete?.id) return;
    await requestLineAPI.delete(lineToDelete.id);
    setLineToDelete(undefined);
    toast.success("Successfully deleted.");
    await loadRequest();
  }

  async function loadRequest() {
    setLoading(true);
    try {
      const data = await requestAPI.find(Number(id));
      if (data && data.status) {
        data.status = data.status.toUpperCase();
      }
      setRequest(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function sendToReview() {
    if (!request?.id) return;
    setLoading(true);
    try {
      await requestAPI.review(request);
      toast.success("Status updated to Review.");
      navigate("/requests");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function approveRequest() {
    if (!request?.id) return;
    setLoading(true);
    try {
      await requestAPI.approve(request);
      toast.success("Request approved.");
      navigate("/requests");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequest();
  }, [id]);

  const isOwnRequest = request?.userId === user?.id;
  const isReviewer = user?.isReviewer;

  return (
    <section className="content container-fluid px-3 px-md-5 my-2 py-4">
      <Modal show={isRejectOpen} onHide={closeReject}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(saveReject)}>
            <div className="mb-3">
              <label className="form-label text-muted" htmlFor="rejectionReason">
                Rejection Reason
              </label>
              <textarea
                {...register("rejectionReason", { required: "Rejection reason is required" })}
                className={`form-control ${errors?.rejectionReason ? "is-invalid" : ""}`}
                id="rejectionReason"
                rows={6}
              ></textarea>
              <div className="invalid-feedback">{errors?.rejectionReason?.message}</div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-primary" onClick={closeReject}>
                Cancel
              </button>
              <button type="submit" className="btn btn-danger">
                Confirm Rejection
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={!!lineToDelete} onHide={handleCloseDeleteItemModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Request Line</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this product from the request?</p>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-primary" onClick={handleCloseDeleteItemModal}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={removeRequestLine}>
              Delete
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <div className="d-flex flex-wrap justify-content-between align-items-center pb-4 mb-4 border-bottom border-2 gap-3">
        <h2 className="mb-0">Request</h2>

        <div className="d-flex flex-wrap align-items-center justify-content-end gap-2">
          <Link to={`/requests/edit/${request?.id}`} className="text-primary text-decoration-none me-2" title="Edit Request">
            <svg width={18} height={18} fill="currentColor">
              <use xlinkHref={`${bootstrapIcons}#pencil`} />
            </svg>
          </Link>

          {request?.status === "NEW" && (
            <button className="btn btn-primary" onClick={sendToReview}>
              Send For Review
            </button>
          )}

          {request?.status === "REVIEW" && (isReviewer || isOwnRequest) && (
            <>
              {isOwnRequest && (
                <div className="alert alert-warning py-1 px-3 mb-0 me-2" role="alert">
                  You cannot approve or reject your own request.
                </div>
              )}
              <button className="btn btn-success" onClick={approveRequest} disabled={isOwnRequest}>
                Approve
              </button>
              <button className="btn btn-outline-danger" onClick={openReject} disabled={isOwnRequest}>
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {request && <RequestHeader request={request} />}
      {request && <RequestLineTable request={request} onDeleteClick={handleShowDeleteItemModal} />}
    </section>
  );
}

export default RequestDetailPage;
