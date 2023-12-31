import { User } from '../interface/User';

export const checkEmail = (email: string) => {
  return email.includes('@');
};

export const comparePassword = (password: string, re_password: string) => {
  return password === re_password;
};

export const checkMissInPut = (user: User) => {
  if (user.email === '') return false;
  else if (user.password === '') return false;
  else if (user.userid === '') return false;
  else if (user.username === '') return false;
  else return true;
};
