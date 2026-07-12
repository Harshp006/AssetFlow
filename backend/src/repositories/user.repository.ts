import prisma from "../utils/prisma";

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

export const findByEmail = async (email: string): Promise<UserEntity | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return null;

  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: user.role,
  };
};

export const create = async (user: Omit<UserEntity, "id">): Promise<UserEntity> => {
  const createdUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
    },
  });

  return {
    id: String(createdUser.id),
    name: createdUser.name,
    email: createdUser.email,
    passwordHash: createdUser.passwordHash,
    role: createdUser.role,
  };
};

export const userRepository = {
  findByEmail,
  create,
};
