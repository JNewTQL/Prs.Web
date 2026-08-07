import { Link, useNavigate, useParams } from "react-router-dom";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import type { IUser } from "./IUser";
import { userAPI } from "./UserAPI";
import toast from "react-hot-toast";

const emptyUser: IUser = {
  id: undefined,
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  email: "",
  phone: "",
  isReviewer: false,
  isAdmin: false,
};

function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    defaultValues: async () => {
      if (!id) return emptyUser;
      return await userAPI.find(Number(id));
    },
  });

  const save: SubmitHandler<IUser> = async (user) => {
    try {
      if (!user.id) {
        await userAPI.post(user);
      } else {
        await userAPI.put(user);
      }
    } catch (error: any) {
      toast.error(error.message, { duration: 6000 });
      return;
    }
    toast.success("Successfully saved.");
    navigate("/users");
  };

  return (
    <form className="w-75" onSubmit={handleSubmit(save)} noValidate>
      <div className="d-flex gap-3 mb-3">
        <div className="w-50">
          <label htmlFor="firstName" className="form-label text-muted">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="Enter first name"
            {...register("firstName", { required: "First name is required" })}
            className={`form-control ${errors?.firstName && "is-invalid"}`}
          />
          <div className="invalid-feedback">{errors?.firstName?.message}</div>
        </div>
        <div className="w-50">
          <label htmlFor="lastName" className="form-label text-muted">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Enter last name"
            {...register("lastName", { required: "Last name is required" })}
            className={`form-control ${errors?.lastName && "is-invalid"}`}
          />
          <div className="invalid-feedback">{errors?.lastName?.message}</div>
        </div>
      </div>
      <div className="d-flex gap-3 mb-3">
        <div className="w-50">
          <label htmlFor="email" className="form-label text-muted">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter email address"
            {...register("email", {
              pattern: { value: /^$|^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
            className={`form-control ${errors?.email && "is-invalid"}`}
          />
          <div className="invalid-feedback">{errors?.email?.message}</div>
        </div>
        <div className="w-50">
          <label htmlFor="phone" className="form-label text-muted">
            Phone
          </label>
          <input id="phone" type="tel" placeholder="Enter phone number" {...register("phone")} className="form-control" />
        </div>
      </div>
      <div className="d-flex gap-3 mb-3">
        <div className="w-50">
          <label htmlFor="username" className="form-label text-muted">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter username"
            {...register("username", {
              required: "Username is required",
              maxLength: { value: 50, message: "Username is too long" },
            })}
            className={`form-control ${errors?.username && "is-invalid"}`}
          />
          <div className="invalid-feedback">{errors?.username?.message}</div>
        </div>
        <div className="w-50">
          <label htmlFor="password" className="form-label text-muted">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            {...register("password", {
              required: "Password is required",
              maxLength: { value: 60, message: "Password is too long" },
            })}
            className={`form-control ${errors?.password && "is-invalid"}`}
          />
          <div className="invalid-feedback">{errors?.password?.message}</div>
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label text-muted d-block">Role</label>
        <div className="form-check form-check-inline">
          <input {...register("isReviewer")} id="isReviewer" type="checkbox" className="form-check-input" />
          <label htmlFor="isReviewer" className="form-check-label">
            Reviewer
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input {...register("isAdmin")} id="isAdmin" type="checkbox" className="form-check-input" />
          <label htmlFor="isAdmin" className="form-check-label">
            Admin
          </label>
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2">
        <Link to="/users" className="btn btn-outline-primary px-4">
          Cancel
        </Link>
        <button type="submit" className="btn btn-primary px-4 d-flex align-items-center gap-2">
          <svg className="bi pe-none" width={16} height={16} fill="#FFFFFF">
            <use xlinkHref={`${bootstrapIcons}#save`} />
          </svg>
          Save user
        </button>
      </div>
    </form>
  );
}

export default UserForm;
