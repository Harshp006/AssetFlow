import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

// Define the interface representing the User structure stored in the database.
export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

// Define the interface for the input required during user registration.
export interface RegisterInput {
  name: string;
  email: string;
  password?: string;
  role: string;
}

// Define the interface for the input required during login.
export interface LoginInput {
  email: string;
  password?: string;
}

// Define the interface for the User information returned to the controller/client.
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

// TODO (Teammate 1): Implement the actual database repository layer.
// We define a repository interface here to allow type checking of the service business logic.
interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: Omit<UserEntity, 'id'>): Promise<UserEntity>;
}

// TODO (Teammate 1): Instantiate and export/inject the actual userRepository implementation.
// This placeholder is kept uninitialized here to avoid mock database storage or fake CRUD code.
let userRepository: IUserRepository;

/**
 * Registers a new user in the system after validating email uniqueness and hashing the password.
 * 
 * @param registerData - Registration payload containing name, email, password, and role.
 * @returns The created user details (excluding password).
 * @throws Error if the user email is already registered, fields are invalid, or password is missing.
 */
export const registerUser = async (registerData: RegisterInput): Promise<UserResponse> => {
  const { name, email, password, role } = registerData;

  // Business Logic: Input Validation
  if (!name || !email || !password || !role) {
    throw new Error('All fields (name, email, password, role) are required.');
  }

  // TODO: userRepository.findByEmail(email)
  // Check whether a user with the same email already exists in the database.
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  // Business Logic: Hash the password using bcrypt with 10 salt rounds.
  const hashedPassword = await bcrypt.hash(password, 10);

  // TODO: userRepository.create(user)
  // Create and save the new user entity in the database.
  const newUser = await userRepository.create({
    name,
    email,
    passwordHash: hashedPassword,
    role,
  });

  // Return ONLY the created user details, omitting the password field.
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
};

/**
 * Authenticates a user by validating their email and password, returning a JWT token on success.
 * 
 * @param loginData - Login payload containing email and password.
 * @returns Object containing the generated JWT token and user details (excluding password).
 * @throws Error if authentication fails (invalid email, incorrect password, or missing fields).
 */
export const loginUser = async (loginData: LoginInput): Promise<{ token: string; user: UserResponse }> => {
  const { email, password } = loginData;

  // Business Logic: Input Validation
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  // TODO: userRepository.findByEmail(email)
  // Find the user by email in the database.
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  // Business Logic: Compare the input password with the stored hashed password using bcrypt.
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  // Business Logic: Generate a JWT for the authenticated user.
  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  // Return token and user details (excluding the password).
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
