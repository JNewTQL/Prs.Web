import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import type { IRequest } from "./IRequest";
import { requestAPI } from "./RequestAPI";
import RequestHeader from "./RequestHeader";
import { SubmitHandler, useForm } from "react-hook-form";
import { Modal } from "react-bootstrap";
import { money } from "../utility/formatUtilities";
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
    await loadRequest();
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
      setRequest(await requestAPI.find(Number(id)));
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
      await loadRequest();
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
      await loadRequest();
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
    <section className="content container-fluid mx-5 my-2 py-4">
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

      <div className="d-flex justify-content-between pb-4 mb-4 border-bottom border-2">
        <h2>Request</h2>
        <div className="d-flex justify-content-end gap-2">
          {isOwnRequest && request?.status === "NEW" && (
            <>
              <Link to={`/requests/edit/${request.id}`} className="btn">
                <svg className="me-2" width={16} height={16}>
                  <use xlinkHref={`${bootstrapIcons}#pencil`} />
                </svg>
              </Link>
              <button className="btn btn-primary" onClick={sendToReview}>
                Review
              </button>
            </>
          )}
          {isReviewer && !isOwnRequest && request?.status === "REVIEW" && (
            <>
              <button className="btn btn-success" onClick={approveRequest}>
                Approve
              </button>
              <button className="btn btn-outline-danger" onClick={openReject}>
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {request && <RequestHeader request={request} />}

      {request && (
        <div className="card p-4 mt-5">
          <h5 className="card-title">Request Lines</h5>
          <table className="table w-75">
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
                    {isOwnRequest && request.status === "NEW" && (
                      <>
                        <Link to={`/requests/detail/${request.id}/requestline/edit/${line.id}`} className="btn btn-outline-primary btn-sm me-2">
                          Edit
                        </Link>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleShowDeleteItemModal(line)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>
                  {isOwnRequest && request.status === "NEW" && (
                    <Link to={`/requests/detail/${request.id}/requestline/create`} className="btn btn-outline-primary">
                      Add Product
                    </Link>
                  )}
                </td>
                <td />
                <td className="fw-bold text-end">Total:</td>
                <td className="fw-bold">{money(request.total)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </section>
  );
}

export default RequestDetailPage;
