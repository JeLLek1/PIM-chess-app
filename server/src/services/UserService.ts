import {
  User,
  getUserById,
  saveUser,
  deleteUser,
} from '../repositories/UserRepository';
import { v4 as uuidv4 } from 'uuid';

export function createUser(userName: string): User | null {
  const newId = uuidv4();
  const newUser = { userId: newId, userName: userName };
  const userFromRep = saveUser(newUser);
  if (!userFromRep) {
    return null;
  }
  return newUser;
}

export function findUser(userId: string): User | null {
  return getUserById(userId);
}

export function removeUser(userId: string): void {
  deleteUser(userId);
}

export default {
  createUser,
  findUser,
  removeUser,
};
