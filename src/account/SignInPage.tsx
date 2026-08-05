import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userAPI } from "../users/UserAPI";
import { useUserContext } from "../App";
import { IUser } from "../users/IUser";

interface IAccount {
  username: string;
  password: string;
}

function persistUser(user: IUser) {
  localStorage.setItem("user", JSON.stringify(user));
}

function SignInPage() {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAccount>({
    defaultValues: async () => ({ username: "", password: "" }),
  });

  const signin: SubmitHandler<IAccount> = async (account) => {
    try {
      const { password: _, ...safeUser } = await userAPI.findByAccount(account.username, account.password);
      persistUser(safeUser as IUser); // localStorage
      setUser(safeUser as IUser); // context
      navigate("/orders");
    } catch (error: any) {
      toast.error("Unsuccessful sign in. Please try again.");
    }
  };

  return (
    <main className="d-flex flex-column gap-4 justify-content-center align-items-center min-vh-100">
      <svg width={80} height={62} viewBox="0 0 50 39" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" fill="#007AFF" />
        <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" fill="#312ECB" />
      </svg>
      <span className="medium mx-2 fw-semibold">Purchase Request System </span>

      <div className="card w-25 p-4">
        <h4 className="card-title">Sign in</h4>
        <form className="d-flex flex-column" onSubmit={handleSubmit(signin)}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input id="username" type="text" {...register("username", { required: "Username is required" })} className={`form-control ${errors?.username && "is-invalid"}`} />
            <div className="invalid-feedback">{errors?.username?.message}</div>
          </div>
          <div className="mb-1">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input id="password" type="password" {...register("password", { required: "Password is required" })} className={`form-control ${errors?.password && "is-invalid"}`} />
            <div className="invalid-feedback">{errors?.password?.message}</div>
          </div>
          <div className="mb-4 form-text">
            <a href="#">Forgot It?</a>
          </div>
          <div className="mb-3 d-grid gap-2">
            <button type="submit" className="btn btn-lg btn-primary">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default SignInPage;
