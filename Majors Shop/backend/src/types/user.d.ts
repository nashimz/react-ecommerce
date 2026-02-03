export interface IUser {
  id: number;
  email: string;
  password: string;
  role: "admin" | "customer";
  name: string;
  surname: string;
  phone: string;
  adresses?: IAddress[];
}
