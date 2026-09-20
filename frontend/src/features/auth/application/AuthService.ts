import type {
  AuthResponse,
  LoginCredentials,
  RegistrationRequest,
} from "../domain/AuthModels";

export interface AuthService {
  signIn(credentials: LoginCredentials): Promise<AuthResponse>;
  register(request: RegistrationRequest): Promise<AuthResponse>;
}
