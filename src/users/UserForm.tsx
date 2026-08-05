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
    <form className="d-flex flex-wrap w-75 gap-2" onSubmit={handleSubmit(save)}>
      <div className="mb-3 w-100">
        <label htmlFor="firstName" className="form-label">
          First Name
        </label>
        <input id="firstName" type="text" {...register("firstName", { required: "First name is required" })} className={`form-control ${errors?.firstName && "is-invalid"}`} />
        <div className="invalid-feedback">{errors?.firstName?.message}</div>
      </div>
      <div className="mb-3 w-100">
        <label htmlFor="lastName" className="form-label">
          Last Name
        </label>
        <input id="lastName" type="text" {...register("lastName", { required: "Last name is required" })} className={`form-control ${errors?.lastName && "is-invalid"}`} />
        <div className="invalid-feedback">{errors?.lastName?.message}</div>
      </div>
      <div className="mb-3 w-50">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          id="username"
          type="text"
          {...register("username", {
            required: "Username is required",
            maxLength: { value: 50, message: "Username is too long" },
          })}
          className={`form-control ${errors?.username && "is-invalid"}`}
        />
        <div className="invalid-feedback">{errors?.username?.message}</div>
      </div>
      <div className="mb-3 w-50">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password", {
            required: "Password is required",
            maxLength: { value: 60, message: "Password is too long" },
          })}
          className={`form-control ${errors?.password && "is-invalid"}`}
        />
        <div className="invalid-feedback">{errors?.password?.message}</div>
      </div>
      <div className="mb-3 w-50">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email", {
            pattern: { value: /^$|^\S+@\S+\.\S+$/, message: "Enter a valid email" },
          })}
          className={`form-control ${errors?.email && "is-invalid"}`}
        />
        <div className="invalid-feedback">{errors?.email?.message}</div>
      </div>
      <div className="mb-3 w-50">
        <label htmlFor="phone" className="form-label">
          Phone
        </label>
        <input id="phone" type="tel" {...register("phone")} className="form-control" />
      </div>
      <div className="mb-3 w-100 mt-2">
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
      <div className="d-flex justify-content-end w-100 mt-4">
        <Link to="/users" className="btn btn-outline-primary me-2">
          Cancel
        </Link>
        <button type="submit" className="btn btn-primary">
          <svg className="bi pe-none me-2" width={16} height={16} fill="#FFFFFF">
            <use xlinkHref={`${bootstrapIcons}#save`} />
          </svg>
          Save User
        </button>
      </div>
    </form>
  );
}

export default UserForm;
