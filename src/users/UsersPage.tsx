import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { IUser } from "./IUser";
import { userAPI } from "./UserAPI";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import toast from "react-hot-toast";
import UserList from "./UserList";

function UserPage() {
  const [loading, setLoading] = useState(false);
  const [users, setUser] = useState<IUser[]>([]);

  const removeUser = (userToRemove: IUser) => {
    setUser(users.filter((s) => s.id !== userToRemove.id));
  };

  async function loadUser() {
    setLoading(true);
    try {
      const data = await userAPI.list();
      setUser(data);
    } catch (error: any) {
      toast.error(error.message, { duration: 6000 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <section className="content container-fluid mx-5 my-2 py-4">
      <div className="d-flex justify-content-between align-items-center pb-4 mb-4 border-bottom border-2">
        <h2>Users ({users.length})</h2>
        <Link to="/users/create" className="btn btn-primary">
          <svg className="bi pe-none me-2" width={32} height={32} fill="#FFFFFF">
            <use xlinkHref={`${bootstrapIcons}#plus`} />
          </svg>
          Create A User
        </Link>
      </div>

      <UserList users={users} loading={loading} onRemove={removeUser} />
    </section>
  );
}

export default UserPage;
