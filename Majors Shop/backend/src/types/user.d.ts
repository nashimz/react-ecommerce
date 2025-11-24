export interface IUser {
  id: number;
  email: string;
  password: string;
  role: "admin" | "customer";
}
