import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { successResponse } from '../utils/response';
import {
  registerAdmin,
  loginUser,
  createEmployee,
  updateUserRole,
  toggleUserActive,
  getCompanyEmployees,
} from '../services/auth.service';

/** POST /api/auth/register/admin — Creates a company + admin user */
export const registerAdminHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { companyName, name, email, password } = req.body;
  const result = await registerAdmin({ companyName, name, email, password });
  successResponse(res, 'Company and admin account created successfully.', result, 201);
});

/** POST /api/auth/login — Company Code + Employee Code + Password */
export const loginHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { companyCode, employeeCode, password } = req.body;
  const result = await loginUser({ companyCode, employeeCode, password });
  successResponse(res, 'Login successful.', result, 200);
});

/** GET /api/auth/me — Return current user from JWT */
export const getMeHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;
  successResponse(res, 'User retrieved.', user, 200);
});

/** POST /api/auth/employees — Admin creates an employee */
export const createEmployeeHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  const companyId = parseInt((req as any).user.companyId, 10);
  const result = await createEmployee({ name, email, password, role: role || 'EMPLOYEE', companyId });
  successResponse(res, 'Employee created successfully.', result, 201);
});

/** GET /api/auth/employees — List all employees in company */
export const listEmployeesHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const companyId = parseInt((req as any).user.companyId, 10);
  const employees = await getCompanyEmployees(companyId);
  successResponse(res, 'Employees retrieved.', employees, 200);
});

/** PATCH /api/auth/employees/:id/role — Admin updates employee role */
export const updateRoleHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id as string);
  const { role } = req.body;
  const companyId = parseInt((req as any).user.companyId, 10);
  const result = await updateUserRole(userId, role, companyId);
  successResponse(res, 'Role updated successfully.', result, 200);
});

/** PATCH /api/auth/employees/:id/toggle-active — Admin activates/deactivates */
export const toggleActiveHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id as string);
  const companyId = parseInt((req as any).user.companyId, 10);
  const result = await toggleUserActive(userId, companyId);
  successResponse(res, 'User status updated.', result, 200);
});
