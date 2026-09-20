import { useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import {
  REGISTRATION_FIELD_ORDER,
  RegistrationValidator,
} from "../../application/RegistrationValidator";
import { RegistrationRequestMapper } from "../../application/RegistrationRequestMapper";
import type { AuthService } from "../../application/AuthService";
import type {
  RegistrationErrors,
  RegistrationField,
  RegistrationFormValues,
} from "../../domain/AuthModels";
import { AuthInput } from "../components/AuthInput";
import { AuthPageLayout } from "../components/AuthPageLayout";

const EMPTY_FORM: RegistrationFormValues = {
  fullName: "",
  phone: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

interface RegisterPageProps {
  authService: AuthService;
  onBackToLogin: () => void;
}

export function RegisterPage({
  authService,
  onBackToLogin,
}: RegisterPageProps) {
  const [values, setValues] = useState<RegistrationFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const fieldRefs = {
    fullName: fullNameRef,
    phone: phoneRef,
    email: emailRef,
    username: usernameRef,
    password: passwordRef,
    confirmPassword: confirmPasswordRef,
  };

  function updateField(field: RegistrationField, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
      ...(field === "password" ? { confirmPassword: undefined } : {}),
    }));
    setMessage("");
  }

  function validateField(field: RegistrationField) {
    const fieldErrors = RegistrationValidator.validate(values);
    setErrors((previous) => ({
      ...previous,
      [field]: fieldErrors[field],
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const nextErrors = RegistrationValidator.validate(values);
    setErrors(nextErrors);
    setMessage("");

    const firstInvalidField = REGISTRATION_FIELD_ORDER.find(
      (field) => nextErrors[field],
    );
    if (firstInvalidField) {
      fieldRefs[firstInvalidField].current?.focus();
      return;
    }

    setPending(true);
    try {
      const response = await authService.register(
        RegistrationRequestMapper.fromForm(values),
      );
      setMessage(response.message);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể đăng ký tài khoản. Vui lòng thử lại.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthPageLayout
      variant="register"
      title="Đăng ký tài khoản"
      subtitle="Tạo tài khoản để bắt đầu quản lý cửa hàng cùng GOAN."
    >
      <form
        className="auth-form"
        onSubmit={submit}
        noValidate
        aria-busy={pending}
      >
        <div className="register-grid">
          <AuthInput
            id="fullName"
            label="Họ và tên"
            value={values.fullName}
            placeholder="Nhập họ và tên"
            error={errors.fullName}
            icon={<UserRound size={19} />}
            inputRef={fullNameRef}
            autoComplete="name"
            autoCapitalize="words"
            onChange={(value) => updateField("fullName", value)}
            onBlur={() => validateField("fullName")}
          />
          <AuthInput
            id="phone"
            label="Số điện thoại"
            value={values.phone}
            placeholder="Nhập số điện thoại"
            error={errors.phone}
            icon={<Phone size={19} />}
            inputRef={phoneRef}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            onChange={(value) => updateField("phone", value)}
            onBlur={() => validateField("phone")}
          />
          <AuthInput
            id="email"
            label="Email"
            value={values.email}
            placeholder="Nhập địa chỉ email"
            error={errors.email}
            icon={<Mail size={19} />}
            inputRef={emailRef}
            type="email"
            inputMode="email"
            autoComplete="email"
            onChange={(value) => updateField("email", value)}
            onBlur={() => validateField("email")}
          />
          <AuthInput
            id="username"
            label="Tên đăng nhập"
            value={values.username}
            placeholder="Nhập tên đăng nhập"
            error={errors.username}
            icon={<AtSign size={19} />}
            inputRef={usernameRef}
            autoComplete="username"
            onChange={(value) => updateField("username", value)}
            onBlur={() => validateField("username")}
          />
          <AuthInput
            id="password"
            label="Mật khẩu"
            value={values.password}
            placeholder="Tối thiểu 8 ký tự, gồm chữ và số"
            error={errors.password}
            icon={<LockKeyhole size={19} />}
            inputRef={passwordRef}
            type={passwordVisible ? "text" : "password"}
            autoComplete="new-password"
            endAction={
              <button
                type="button"
                className="icon-button"
                aria-label={passwordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                aria-pressed={passwordVisible}
                onClick={() => setPasswordVisible((current) => !current)}
              >
                {passwordVisible ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            }
            onChange={(value) => updateField("password", value)}
            onBlur={() => validateField("password")}
          />
          <AuthInput
            id="confirmPassword"
            label="Xác nhận mật khẩu"
            value={values.confirmPassword}
            placeholder="Nhập lại mật khẩu"
            error={errors.confirmPassword}
            icon={<LockKeyhole size={19} />}
            inputRef={confirmPasswordRef}
            type={confirmationVisible ? "text" : "password"}
            autoComplete="new-password"
            endAction={
              <button
                type="button"
                className="icon-button"
                aria-label={
                  confirmationVisible
                    ? "Ẩn mật khẩu xác nhận"
                    : "Hiện mật khẩu xác nhận"
                }
                aria-pressed={confirmationVisible}
                onClick={() => setConfirmationVisible((current) => !current)}
              >
                {confirmationVisible ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            }
            onChange={(value) => updateField("confirmPassword", value)}
            onBlur={() => validateField("confirmPassword")}
          />
        </div>

        {message && (
          <p className="form-message" role="status">
            {message}
          </p>
        )}
        <button type="submit" className="primary-button" disabled={pending}>
          {pending ? "Đang đăng ký…" : "Đăng ký tài khoản"}
          <ArrowRight size={19} />
        </button>
      </form>

      <p className="auth-switch">
        Đã có tài khoản?{" "}
        <button type="button" className="text-button" onClick={onBackToLogin}>
          <ArrowLeft size={15} /> Quay lại đăng nhập
        </button>
      </p>
    </AuthPageLayout>
  );
}
