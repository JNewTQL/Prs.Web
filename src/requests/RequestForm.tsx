import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import toast from "react-hot-toast";

import type { IRequest } from "./IRequest";
import type { IUser } from "../users/IUser";
import { requestAPI } from "./RequestAPI";
import { userAPI } from "../users/UserAPI";
import { useUserContext } from "../App";

let emptyRequest: Partial<IRequest> = {
  id: undefined,
  description: "",
  justification: "",
  deliveryMode: "",
  status: "NEW",
  rejectionReason: undefined,
  total: 0,
  userId: undefined,
  requestLines: [],
};

function RequestForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { user } = useUserContext();
  const [usersList, setUserList] = useState<IUser[]>([]);
  const isEdit = Boolean(id);

  async function loadUser() {
    setUserList(await userAPI.list());
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRequest>({
    defaultValues: async () => {
      await loadUser();
      if (!id) {
        emptyRequest.userId = user?.id;
        return emptyRequest as IRequest;
      }
      return await requestAPI.find(Number(id));
    },
  });

  const save: SubmitHandler<IRequest> = async (request) => {
    try {
      if (!request.id) {
        const newRequest = await requestAPI.post(request);
        toast.success("Request successfully created.");
        navigate(`/requests/detail/${newRequest.id}`);
      } else {
        await requestAPI.put(request);
        toast.success("Request successfully updated.");
        navigate(`/requests/detail/${request.id}`);
      }
    } catch (error: any) {
      toast.error(error.message, { duration: 6000 });
    }
  };

  return (
    <form className="d-flex w-100 gap-5" onSubmit={handleSubmit(save)}>
      <div className="d-flex flex-column w-50 gap-3">
        <div>
          <label htmlFor="description" className="form-label text-body-secondary mb-1">
            Description
          </label>
          <input
            id="description"
            type="text"
            placeholder="Enter a brief description for your purchase"
            {...register("description", { required: "Description is required" })}
            className={`form-control ${errors?.description ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors?.description?.message}</div>
        </div>

        <div>
          <label htmlFor="justification" className="form-label text-body-secondary mb-1">
            Justification
          </label>
          <input
            id="justification"
            type="text"
            placeholder="Enter a justification for your purchase request"
            {...register("justification", { required: "Justification is required" })}
            className={`form-control ${errors?.justification ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors?.justification?.message}</div>
        </div>
      </div>

      <div className="d-flex flex-column w-50 gap-3">
        <div>
          <label htmlFor="deliveryMode" className="form-label text-body-secondary mb-1">
            Delivery Method
          </label>
          <select id="deliveryMode" {...register("deliveryMode", { required: "Delivery method is required" })} className={`form-select ${errors?.deliveryMode ? "is-invalid" : ""}`}>
            <option value="">Select...</option>
            <option value="Pickup">Pickup</option>
            <option value="Delivery">Delivery</option>
            <option value="Signature Delivery">Signature Delivery</option>
          </select>
          <div className="invalid-feedback">{errors?.deliveryMode?.message}</div>
        </div>

        <div>
          <label htmlFor="status" className="form-label text-body-secondary mb-1">
            Status
          </label>
          <select
            id="status"
            {...register("status", { required: "Status is required" })}
            disabled={!isEdit}
            className={`form-select ${!isEdit ? "text-muted" : ""} ${errors?.status ? "is-invalid" : ""}`}
          >
            <option value="NEW">New</option>
            <option value="REVIEW">Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <div className="invalid-feedback">{errors?.status?.message}</div>
        </div>

        <div>
          <label htmlFor="userId" className="form-label text-body-secondary mb-1">
            Requested By
          </label>
          <select id="userId" {...register("userId", { required: "User is required" })} disabled className={`form-select text-muted ${errors?.userId ? "is-invalid" : ""}`}>
            <option value="">Select User</option>
            {usersList.map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{errors?.userId?.message}</div>
        </div>

        <div className="d-flex justify-content-end gap-3 mt-4">
          <button type="button" className="btn btn-outline-primary px-4" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary px-4">
            <svg className="bi pe-none me-2" width={16} height={16} fill="#FFFFFF">
              <use xlinkHref={`${bootstrapIcons}#save`} />
            </svg>
            Save request
          </button>
        </div>
      </div>
    </form>
  );
}

export default RequestForm;
