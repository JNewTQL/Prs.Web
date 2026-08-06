import { IRequestLine } from "../requestLines/IRequestLine";
import type { IUser } from "../users/IUser";

export interface IRequest {
  id: number | undefined;
  description: string;
  justification: string | undefined;
  deliveryMode: string;
  status: string;
  total: number;
  userId: number | undefined;
  user: IUser | undefined;
  rejectionReason: string | undefined;
  requestLines?: IRequestLine[];
}
