export interface IVendor {
  id: number | undefined;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: number;
  email?: string;
}
