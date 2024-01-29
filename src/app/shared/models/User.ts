export interface IUser {
  id: number;
  username: string;
  password: string;
  role: 'admin' | 'customer'; // Role should be either 'admin' or 'customer'
}
