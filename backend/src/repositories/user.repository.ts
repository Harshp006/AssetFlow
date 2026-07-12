import prisma from '../utils/prisma';

export const userRepository = {
  findByEmail: async (email: string) => {
    return prisma.user.findFirst({ where: { email } });
  },

  create: async (data: {
    companyId: number;
    name: string;
    email: string;
    employeeCode: string;
    passwordHash: string;
    role: string;
  }) => {
    return prisma.user.create({ data });
  },
};
