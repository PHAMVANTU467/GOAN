export interface RegistrationFormValues {
  fullName: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export type RegistrationField = keyof RegistrationFormValues;
export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

export interface RegistrationRequest {
  fullName: string;
  phone: string;
  email: string;
  username: string;
  password: string;
}

export interface RegistrationService {
  register(request: RegistrationRequest): Promise<void>;
}

export const REGISTRATION_FIELD_ORDER: RegistrationField[] = [
  "fullName",
  "phone",
  "email",
  "username",
  "password",
  "confirmPassword",
];

export class RegistrationValidator {
  static validate(values: RegistrationFormValues): RegistrationErrors {
    const errors: RegistrationErrors = {};
    const fullName = values.fullName.trim();
    const phone = values.phone.trim().replace(/[\s.-]/g, "");
    const email = values.email.trim();
    const username = values.username.trim();

    if (!fullName) errors.fullName = "Vui lòng nhập họ và tên.";
    else if (fullName.length < 2)
      errors.fullName = "Họ và tên phải có ít nhất 2 ký tự.";

    if (!phone) errors.phone = "Vui lòng nhập số điện thoại.";
    else if (!/^(?:0|\+84)[35789]\d{8}$/.test(phone))
      errors.phone = "Số điện thoại chưa hợp lệ.";

    if (!email) errors.email = "Vui lòng nhập email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Email chưa hợp lệ.";

    if (!username) errors.username = "Vui lòng nhập tên đăng nhập.";
    else if (!/^[a-zA-Z0-9._]{4,30}$/.test(username))
      errors.username =
        "Tên đăng nhập gồm 4–30 ký tự: chữ, số, dấu chấm hoặc gạch dưới.";

    if (!values.password) errors.password = "Vui lòng nhập mật khẩu.";
    else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(values.password))
      errors.password = "Mật khẩu cần ít nhất 8 ký tự, gồm chữ và số.";

    if (!values.confirmPassword)
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    else if (values.confirmPassword !== values.password)
      errors.confirmPassword = "Mật khẩu xác nhận không khớp.";

    return errors;
  }
}

export class RegistrationRequestMapper {
  static fromForm(values: RegistrationFormValues): RegistrationRequest {
    return {
      fullName: values.fullName.trim(),
      phone: values.phone.trim().replace(/[\s.-]/g, ""),
      email: values.email.trim().toLowerCase(),
      username: values.username.trim(),
      password: values.password,
    };
  }
}

/** UI-only adapter. Replace with the .NET registration API implementation. */
export class UnavailableRegistrationService implements RegistrationService {
  async register(_request: RegistrationRequest): Promise<void> {
    throw new Error("Dịch vụ đăng ký chưa được kết nối. Vui lòng thử lại sau.");
  }
}
