import { IVendor } from "../vendors/IVendor";

export interface IProduct {
  id: number | undefined;
  name: string;
  partNumber: string;
  price: string;
  unit: string;
  vendorId?: number;
  vendor?: IVendor;
}
