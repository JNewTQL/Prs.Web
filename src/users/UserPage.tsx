import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { IUser } from "./IUser";
import { userAPI } from "./UserAPI";
import UserCard from "./UserCard";
import UserCardSkeleton from "./UserCardSkeleton";
import bootstrapIcons from "../assets/bootstrap-icons.svg";
import toast from "react-hot-toast";

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

  const userCardSkeletons = Array.from(Array(12), (_v, i) => <UserCardSkeleton key={i} />);

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

      <section className="list d-flex flex-row flex-wrap bg-light gap-5 p-4 rounded-4">
        {loading && userCardSkeletons}
        {!loading && users.map((user) => <UserCard key={user.id} user={user} onRemove={removeUser} />)}
      </section>
    </section>
  );
}

export default UserPage;
