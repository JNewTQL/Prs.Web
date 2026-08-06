import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
    <form className="d-flex flex-wrap w-75 gap-4" onSubmit={handleSubmit(save)}>
      <div className="w-50">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <input id="description" type="text" {...register("description", { required: "Description is required" })} className={`form-control ${errors?.description ? "is-invalid" : ""}`} />
        <div className="invalid-feedback">{errors?.description?.message}</div>
      </div>

      <div className="w-50">
        <label htmlFor="deliveryMode" className="form-label">
          Delivery Mode
        </label>
        <input id="deliveryMode" type="text" {...register("deliveryMode", { required: "Delivery mode is required" })} className={`form-control ${errors?.deliveryMode ? "is-invalid" : ""}`} />
        <div className="invalid-feedback">{errors?.deliveryMode?.message}</div>
      </div>

      <div className="w-100">
        <label htmlFor="justification" className="form-label">
          Justification
        </label>
        <textarea id="justification" {...register("justification", { required: "Justification is required" })} className={`form-control ${errors?.justification ? "is-invalid" : ""}`} rows={2} />
        <div className="invalid-feedback">{errors?.justification?.message}</div>
      </div>

      <div className="w-50">
        <label htmlFor="userId" className="form-label">
          Assigned User
        </label>
        <select id="userId" {...register("userId", { required: "User is required" })} disabled className={`form-select ${errors?.userId ? "is-invalid" : ""}`}>
          <option value="">Select User</option>
          {usersList.map((u) => (
            <option key={u.id} value={u.id}>
              {u.firstName} {u.lastName}
            </option>
          ))}
        </select>
        <div className="invalid-feedback">{errors?.userId?.message}</div>
      </div>

      <div className="w-50">
        <label htmlFor="status" className="form-label">
          Request Status
        </label>
        <select id="status" {...register("status")} disabled className={`form-select text-muted ${errors?.status ? "is-invalid" : ""}`}>
          <option value="NEW">New</option>
          <option value="REVIEW">Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <div className="invalid-feedback">{errors?.status?.message}</div>
      </div>

      {isEdit && (
        <div className="w-100">
          <label htmlFor="rejectionReason" className="form-label">
            Rejection Reason
          </label>
          <textarea id="rejectionReason" {...register("rejectionReason")} className="form-control text-muted" disabled rows={2} />
        </div>
      )}

      <div className="d-flex justify-content-end w-100 mt-2">
        <Link to="/requests" className="btn btn-outline-primary me-2">
          Cancel
        </Link>
        <button type="submit" className="btn btn-primary">
          <svg className="bi pe-none me-2" width={16} height={16} fill="#FFFFFF">
            <use xlinkHref={`${bootstrapIcons}#save`} />
          </svg>
          Save Request
        </button>
      </div>
    </form>
  );
}

export default RequestForm;
