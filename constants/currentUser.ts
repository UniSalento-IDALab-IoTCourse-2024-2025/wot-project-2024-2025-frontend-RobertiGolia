import { User } from './users';

let currentUser: User | null = null;

export const setCurrentUser = (user: User) => {
  currentUser = user;
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const clearCurrentUser = () => {
  currentUser = null;
}; 