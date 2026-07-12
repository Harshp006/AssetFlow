import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';

// Extend the Express Request interface to include the strongly typed 'user' property.
// This leverages TypeScript's declaration merging, making 'req.user' accessible in other route handlers.
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware to authenticate requests using JSON Web Tokens (JWT).
 * Expects an Authorization header in the format: 'Bearer <token>'
 * 
 * - Missing header or malformed header -> Returns HTTP 401
 * - Invalid or expired token -> Returns HTTP 401
 * - Successful verification -> Attaches payload to req.user and proceeds
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  try {
    // 1. Retrieve the Authorization header from incoming request headers.
    const authHeader = req.headers.authorization;

    // 2. Validate header existence and ensure it uses the standard Bearer scheme.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authorization header is missing or malformed.',
      });
    }

    // 3. Extract the token value from the header (ignoring the "Bearer " prefix).
    const token = authHeader.split(' ')[1];

    // 4. Verify the extracted token. If invalid or expired, verifyToken will throw an error.
    const decoded = verifyToken(token);

    // 5. Attach the decoded payload to the request object for downstream usage in routes/controllers.
    req.user = decoded;

    // 6. Delegate execution to the next handler/middleware in the stack.
    next();
  } catch (error) {
    // 7. Handle token verification failures (e.g. JsonWebTokenError, TokenExpiredError) by returning HTTP 401.
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid or expired token.',
    });
  }
};
