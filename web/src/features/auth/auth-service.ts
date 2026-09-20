export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface AuthService {
  signIn(credentials: LoginCredentials): Promise<void>;
}

/** UI-only adapter: never simulates an authenticated session or stores secrets. */
export class UnavailableAuthService implements AuthService {
  async signIn(_credentials: LoginCredentials): Promise<void> {
    throw new Error(
      "Dịch vụ đăng nhập chưa được kết nối. Vui lòng thử lại sau.",
    );
  }
}

export type LoginErrors = Partial<Record<keyof LoginCredentials, string>>;

export class LoginValidator {
  static validate({ identifier, password }: LoginCredentials): LoginErrors {
    const errors: LoginErrors = {};
    const value = identifier.trim();
    const isPhone = /^(?:0|\+84)[35789]\d{8}$/.test(
      value.replace(/[\s.-]/g, ""),
    );
    if (!value) errors.identifier = "Vui lòng nhập số điện thoại.";
    else if (!isPhone)
      errors.identifier = "Số điện thoại chưa hợp lệ.";
    if (!password) errors.password = "Vui lòng nhập mật khẩu.";
    return errors;
  }
}
