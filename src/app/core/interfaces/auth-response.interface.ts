import { UserModel } from '../models/user.model';

export interface AuthResponseInterface {
  user: UserModel;
  token?: string;
  expiresIn?: number;
}
