import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a random 4-digit number string padded to 4 places */
const rand4 = () => Math.floor(1000 + Math.random() * 9000).toString();

/** Generate a unique company code like "ASF-4829" */
const generateCompanyCode = () => `ASF-${rand4()}`;

/** Generate employee code based on role like "ADM-0001", "EMP-0023" */
const generateEmployeeCode = async (companyId: number, role: string): Promise<string> => {
  const prefix = role === 'ADMIN' ? 'ADM' : role === 'ASSET_MANAGER' ? 'MGR' : role === 'DEPARTMENT_HEAD' ? 'DHD' : 'EMP';
  const count = await prisma.user.count({ where: { companyId } });
  return `${prefix}-${String(count + 1).padStart(4, '0')}`;
};

// ─── Admin Registration (Creates Company + Admin User) ────────────────────────

export interface AdminRegisterInput {
  companyName: string;
  name: string;
  email: string;
  password: string;
}

export const registerAdmin = async (input: AdminRegisterInput) => {
  const { companyName, name, email, password } = input;

  if (!companyName || !name || !email || !password) {
    throw new Error('All fields are required.');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  // Generate unique company code
  let companyCode = generateCompanyCode();
  let existing = await prisma.company.findUnique({ where: { companyCode } });
  while (existing) {
    companyCode = generateCompanyCode();
    existing = await prisma.company.findUnique({ where: { companyCode } });
  }

  // Create company
  const company = await prisma.company.create({
    data: { name: companyName, companyCode },
  });

  // Check if admin email already exists globally
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const employeeCode = 'ADM-0001'; // First admin always gets ADM-0001

  const user = await prisma.user.create({
    data: {
      companyId: company.id,
      name,
      email,
      employeeCode,
      passwordHash,
      role: 'ADMIN',
    },
  });

  const token = generateToken({ userId: String(user.id), role: user.role, companyId: String(company.id) });

  return {
    token,
    companyCode: company.companyCode,
    companyName: company.name,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      employeeCode: user.employeeCode,
      role: user.role,
    },
  };
};

// ─── Login (Company Code + Employee Code + Password) ─────────────────────────

export interface LoginInput {
  companyCode: string;
  employeeCode: string;
  password: string;
}

export const loginUser = async (input: LoginInput) => {
  const { companyCode, employeeCode, password } = input;

  if (!companyCode || !employeeCode || !password) {
    throw new Error('Company code, employee code, and password are required.');
  }

  const company = await prisma.company.findUnique({ where: { companyCode } });
  if (!company) {
    throw new Error('Invalid company code.');
  }

  const user = await prisma.user.findFirst({
    where: { companyId: company.id, employeeCode },
  });
  if (!user) {
    throw new Error('Invalid employee code or password.');
  }

  if (!user.isActive) {
    throw new Error('Your account has been deactivated. Contact your Admin.');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid employee code or password.');
  }

  const token = generateToken({ userId: String(user.id), role: user.role, companyId: String(company.id) });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      employeeCode: user.employeeCode,
      role: user.role,
      companyId: company.id,
      companyCode: company.companyCode,
      companyName: company.name,
    },
  };
};

// ─── Admin: Create Employee ───────────────────────────────────────────────────

export interface CreateEmployeeInput {
  name: string;
  email: string;
  password: string;
  role: string;
  companyId: number;
}

export const createEmployee = async (input: CreateEmployeeInput) => {
  const { name, email, password, role, companyId } = input;

  if (!name || !email || !password) throw new Error('Name, email and password are required.');

  const validRoles = ['EMPLOYEE', 'ASSET_MANAGER', 'DEPARTMENT_HEAD'];
  if (!validRoles.includes(role)) throw new Error('Invalid role.');

  // Check email uniqueness within the company
  const existing = await prisma.user.findFirst({ where: { companyId, email } });
  if (existing) throw new Error('A user with this email already exists in the company.');

  const passwordHash = await bcrypt.hash(password, 10);
  const employeeCode = await generateEmployeeCode(companyId, role);

  const user = await prisma.user.create({
    data: { companyId, name, email, employeeCode, passwordHash, role },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    employeeCode: user.employeeCode,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};

// ─── Admin: Update Role ───────────────────────────────────────────────────────

export const updateUserRole = async (userId: number, role: string, companyId: number) => {
  const validRoles = ['EMPLOYEE', 'ASSET_MANAGER', 'DEPARTMENT_HEAD'];
  if (!validRoles.includes(role)) throw new Error('Invalid role. Cannot set role to ADMIN.');

  const user = await prisma.user.findFirst({ where: { id: userId, companyId } });
  if (!user) throw new Error('User not found in your company.');

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, name: true, email: true, employeeCode: true, role: true, isActive: true },
  });
  return updated;
};

// ─── Admin: Toggle User Active ────────────────────────────────────────────────

export const toggleUserActive = async (userId: number, companyId: number) => {
  const user = await prisma.user.findFirst({ where: { id: userId, companyId } });
  if (!user) throw new Error('User not found in your company.');

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
    select: { id: true, name: true, email: true, employeeCode: true, role: true, isActive: true },
  });
  return updated;
};

// ─── Get Company Employees ────────────────────────────────────────────────────

export const getCompanyEmployees = async (companyId: number) => {
  return prisma.user.findMany({
    where: { companyId },
    select: {
      id: true,
      name: true,
      email: true,
      employeeCode: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: { select: { assets: true, requestedRequests: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
};
