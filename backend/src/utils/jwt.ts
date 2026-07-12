import jwt from 'jsonwebtoken';

/**
 * Interface representing the structure of the token payload.
 * This ensures type safety when creating or verifying tokens in AssetFlow.
 */
export interface TokenPayload {
  /** The unique identifier of the user (e.g. database ID) */
  userId: string;
  /** Optional user role for access control (e.g., 'admin', 'user') */
  role?: string;
  /** Additional custom payload claims */
  [key: string]: any;
}

/**
 * Helper function to retrieve the JWT_SECRET from environment variables.
 * Throwing an error inside this function prevents application-wide crashes
 * at import time if environment variables are not yet loaded.
 * 
 * @returns The JWT secret key string.
 */
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in the environment variables.');
  }
  return secret;
};

/**
 * Generates a JSON Web Token (JWT) signed with the JWT secret.
 * 
 * @param payload - The payload object containing user information to be encoded in the token.
 * @returns The signed JWT string.
 */
export const generateToken = (payload: TokenPayload): string => {
  const secret = getJwtSecret();
  
  // Sign the token with the specified payload and secret.
  // The token is configured to expire in 7 days ('7d') as per business requirements.
  return jwt.sign(payload, secret, {
    expiresIn: '7d',
  });
};

/**
 * Verifies a JSON Web Token (JWT) and decodes its payload.
 * 
 * @param token - The JWT string to verify.
 * @returns The decoded token payload.
 * @throws An error if the signature is invalid, token is expired, or payload format is invalid.
 */
export const verifyToken = (token: string): TokenPayload => {
  const secret = getJwtSecret();
  
  // Verify the signature and expiration of the token.
  // jwt.verify throws an error if verification fails.
  const decoded = jwt.verify(token, secret);
  
  // Verify that the decoded payload is an object rather than a plain string.
  if (!decoded || typeof decoded === 'string') {
    throw new Error('Invalid token payload format');
  }
  
  // Cast and return the verified payload as TokenPayload.
  return decoded as TokenPayload;
};
