import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import asyncHandler from '../utils/asyncHandler';
import { successResponse } from '../utils/response';

/**
 * Controller to handle user registration.
 * 
 * - Extracts name, email, password, and role from the request body.
 * - Invokes the authentication service to register the user.
 * - On success, returns HTTP 201 with the created user object and JWT token.
 */
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  const result = await registerUser({ name, email, password, role });

  successResponse(res, 'User registered successfully.', result, 201);
});

/**
 * Controller to handle user login.
 * 
 * - Extracts email and password from the request body.
 * - Invokes the authentication service to verify credentials and generate token.
 * - On success, returns HTTP 200 with the JWT token and the authenticated user details.
 */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const result = await loginUser({ email, password });

  successResponse(res, 'Login successful.', result, 200);
});

