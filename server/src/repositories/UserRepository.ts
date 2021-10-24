export type User = {
  userId: string;
  userName: string;
};

const users = new Map<string, User>();

export function saveUser(user: User): User | null {
  const existingUser = getUserById(user.userId);
  if (!existingUser) {
    users.set(user.userId, user);
    return user;
  }
  return null;
}

export function getUserById(userId: string): User | null {
  const user = users.get(userId);
  return user ? user : null;
}

export function deleteUser(userId: string): boolean {
  return users.delete(userId);
}

export default {
  getUserById,
  saveUser,
  deleteUser,
};
