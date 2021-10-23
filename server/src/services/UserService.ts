import { User, getUserById, saveUser, deleteUser } from "../repositories/UserRepository";
import { generateRandomString } from "../utils/stringUtils";

export function createUser(userName: string): User | null {
  for (let i = 0; i < 10; i++) {
    const newId = generateRandomString(32);
    const newUser = { userId: newId, userName: userName };
    const userFromRep = saveUser(newUser);
    if (userFromRep) {
      return newUser;
    }
  }
  return null;
}

export function findUser(userId: string): User | null {
  return getUserById(userId);
}

export function removeUser(userId: string): void {
  deleteUser(userId);
}

export default {
  createUser: createUser,
  findUser: findUser,
  removeUser: removeUser,
}