import UserCard from "./UserCard";
import type { IUser } from "./IUser";
import UserCardSkeleton from "./UserCardSkeleton";

interface IUserListProps {
  users: IUser[];
  loading: boolean;
  onRemove: (user: IUser) => void;
}

function UserList({ users, loading, onRemove }: IUserListProps) {
  const userCardSkeletons = Array.from(Array(12), (_value, index) => <UserCardSkeleton key={index} />);

  return (
    <section className="list d-flex flex-row flex-wrap bg-light gap-5 p-4 rounded-4">
      {loading && userCardSkeletons}
      {!loading && users.map((user) => <UserCard key={user.id} user={user} onRemove={onRemove} />)}
    </section>
  );
}

export default UserList;
