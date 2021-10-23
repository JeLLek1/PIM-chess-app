import { createUser } from "../services/UserService";
import { generateRandomString } from "../utils/stringUtils";

export type User = {
  userId: string;
  userName: string;
};

const users: User[] = [];

export function saveUser(user: User): User | null {
  const existingUser = getUserById(user.userId);
  if (!existingUser) {
    users.push(user);
    return user;
  }
  return null;
}

export function getUserById(userId: string): User | null {
  const user = users.find(u => u.userId === userId);
  return user ? user : null;
}

export function deleteUser(userId: string): void {
  const usersIndex = users.findIndex(u => u.userId === userId);
  if (usersIndex >= 0) {
    users.splice(usersIndex, 1);
  }
}

export default {
  getUserById: getUserById,
  saveUser: saveUser,
  deleteUser: deleteUser,
}