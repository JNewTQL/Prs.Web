export interface IUser {
  id: number | undefined;
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
  phone: string;
  email: string;
  isReviewer: boolean;
  isAdmin: boolean;
}
