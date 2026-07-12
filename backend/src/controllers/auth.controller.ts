import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

/**
 * Controller to handle user registration.
 * 
 * - Extracts name, email, password, and role from the request body.
 * - Invokes the authentication service to register the user.
 * - On success, returns HTTP 201 with the created user object.
 * - On failure (validation/business logic), returns HTTP 400 with the error message.
 */
export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, role } = req.body;

    const user = await registerUser({ name, email, password, role });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      user,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration.';
    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

/**
 * Controller to handle user login.
 * 
 * - Extracts email and password from the request body.
 * - Invokes the authentication service to verify credentials and generate token.
 * - On success, returns HTTP 200 with the JWT token and the authenticated user details.
 * - On invalid credentials, returns HTTP 401.
 * - On other validation or system errors, handles errors cleanly and returns HTTP 400.
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const { token, user } = await loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during login.';

    if (errorMessage === 'Invalid email or password.') {
      return res.status(401).json({
        success: false,
        message: errorMessage,
      });
    }

    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};
