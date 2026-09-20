import type { LoginCredentials, LoginErrors } from "../domain/AuthModels";

export class LoginValidator {
  static validate({ identifier, password }: LoginCredentials): LoginErrors {
    const errors: LoginErrors = {};
    const value = identifier.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isUsername = /^[a-zA-Z0-9._]{4,30}$/.test(value);
    const isPhone = /^(?:0|\+84)[35789]\d{8}$/.test(
      value.replace(/[\s.-]/g, ""),
    );

    if (!value) errors.identifier = "Vui lòng nhập tên đăng nhập, email hoặc số điện thoại.";
    else if (!isEmail && !isPhone && !isUsername)
      errors.identifier = "Tên đăng nhập, email hoặc số điện thoại chưa hợp lệ.";

    if (!password) errors.password = "Vui lòng nhập mật khẩu.";

    return errors;
  }
}
