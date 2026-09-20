import { useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { InfoDialog, type DialogContent } from "../../components/InfoDialog";
import { AuthInput } from "./components/AuthInput";
import { AuthPageLayout } from "./components/AuthPageLayout";
import {
  LoginValidator,
  type AuthService,
  type LoginErrors,
} from "./auth-service";

const forgotPasswordInformation: DialogContent = {
  title: "Khôi phục mật khẩu",
  description:
    "Chức năng khôi phục qua email đang được phát triển. Trong thời gian này, vui lòng liên hệ quản trị viên cửa hàng để được hỗ trợ đặt lại mật khẩu.",
};

interface LoginPageProps {
  authService: AuthService;
  onRegister: () => void;
}

export function LoginPage({ authService, onRegister }: LoginPageProps) {
  const [visible, setVisible] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [dialog, setDialog] = useState<DialogContent | null>(null);
  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function validateField(field: "identifier" | "password") {
    const fieldErrors = LoginValidator.validate({
      identifier: identifier.trim(),
      password,
    });
    setErrors((previous) => ({
      ...previous,
      [field]: fieldErrors[field],
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const credentials = { identifier: identifier.trim(), password };
    const nextErrors = LoginValidator.validate(credentials);
    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length) {
      (nextErrors.identifier ? identifierRef : passwordRef).current?.focus();
      return;
    }

    setPending(true);
    try {
      await authService.signIn(credentials);
      setMessage(
        "Đã xác thực. Trang quản lý cửa hàng chưa được triển khai trong bản giao diện này.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể đăng nhập. Vui lòng thử lại.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <AuthPageLayout title="Đăng nhập">
        <form
          className="auth-form"
          onSubmit={submit}
          noValidate
          aria-busy={pending}
        >
          <AuthInput
            id="identifier"
            label="Email hoặc số điện thoại"
            value={identifier}
            placeholder="Nhập email hoặc số điện thoại"
            error={errors.identifier}
            icon={<Mail size={19} />}
            inputRef={identifierRef}
            autoComplete="username"
            onChange={(value) => {
              setIdentifier(value);
              setErrors((previous) => ({
                ...previous,
                identifier: undefined,
              }));
              setMessage("");
            }}
            onBlur={() => validateField("identifier")}
          />
          <AuthInput
            id="password"
            label="Mật khẩu"
            value={password}
            placeholder="Nhập mật khẩu của bạn"
            error={errors.password}
            icon={<LockKeyhole size={19} />}
            inputRef={passwordRef}
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            endAction={
              <button
                type="button"
                className="icon-button"
                aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                aria-pressed={visible}
                onClick={() => setVisible((current) => !current)}
              >
                {visible ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            }
            onChange={(value) => {
              setPassword(value);
              setErrors((previous) => ({
                ...previous,
                password: undefined,
              }));
              setMessage("");
            }}
            onBlur={() => validateField("password")}
          />

          <div className="form-options">
            <label className="remember-option">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              <span>Duy trì đăng nhập</span>
            </label>
            <button
              type="button"
              className="text-button"
              onClick={() => setDialog(forgotPasswordInformation)}
            >
              Quên mật khẩu?
            </button>
          </div>

          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}
          <button type="submit" className="primary-button" disabled={pending}>
            {pending ? "Đang đăng nhập…" : "Đăng nhập"}
            <ArrowRight size={19} />
          </button>
        </form>

        <p className="auth-switch">
          Bạn chưa có tài khoản?{" "}
          <button type="button" className="text-button" onClick={onRegister}>
            Đăng ký tài khoản <ArrowUpRight size={15} />
          </button>
        </p>
      </AuthPageLayout>
      <InfoDialog content={dialog} onClose={() => setDialog(null)} />
    </>
  );
}
