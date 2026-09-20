export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegistrationFormValues {
  fullName: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface RegistrationRequest {
  fullName: string;
  phone: string;
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  fullName: string;
  message: string;
}

export type AccountProfile = Pick<AuthResponse, "userId" | "fullName">;

export type LoginErrors = Partial<Record<keyof LoginCredentials, string>>;
export type RegistrationField = keyof RegistrationFormValues;
export type RegistrationErrors = Partial<Record<RegistrationField, string>>;
