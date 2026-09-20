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
import {
  LoginValidator,
  type AuthService,
  type LoginErrors,
} from "./auth-service";

const information = {
  register: {
    title: "Bắt đầu cùng Goan",
    description:
      "Chức năng đăng ký cửa hàng đang được phát triển. Bạn sẽ có thể tạo cửa hàng, lựa chọn gói dịch vụ và thiết lập chi nhánh đầu tiên ngay tại đây.",
  },
  forgot: {
    title: "Khôi phục mật khẩu",
    description:
      "Chức năng khôi phục qua email đang được phát triển. Trong thời gian này, vui lòng liên hệ quản trị viên cửa hàng để được hỗ trợ đặt lại mật khẩu.",
  },
} satisfies Record<string, DialogContent>;

export function LoginPage({ authService }: { authService: AuthService }) {
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
    <main className="page-shell">
      <div className="background-image" aria-hidden="true" />
      <div className="background-overlay" aria-hidden="true" />

      <div className="login-layout">
        <section className="login-card" aria-labelledby="login-title">
          <div className="brand">
            <img src="/images/goan-logo.png" alt="GOAN" />
          </div>
          <div className="welcome">
            <h2 id="login-title">Đăng nhập</h2>
          </div>
          <form
            className="login-form"
            onSubmit={submit}
            noValidate
            aria-busy={pending}
          >
            <div className="field-group">
              <label htmlFor="identifier">Email hoặc số điện thoại</label>
              <div
                className={`input-wrap ${errors.identifier ? "invalid" : ""}`}
              >
                <Mail size={19} />
                <input
                  ref={identifierRef}
                  id="identifier"
                  name="username"
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="Nhập email hoặc số điện thoại"
                  value={identifier}
                  onBlur={() => validateField("identifier")}
                  onChange={(event) => {
                    setIdentifier(event.target.value);
                    setErrors((previous) => ({
                      ...previous,
                      identifier: undefined,
                    }));
                    setMessage("");
                  }}
                  aria-invalid={!!errors.identifier}
                  aria-describedby={
                    errors.identifier ? "identifier-error" : undefined
                  }
                />
              </div>
              {errors.identifier && (
                <p className="field-error" id="identifier-error" role="alert">
                  {errors.identifier}
                </p>
              )}
            </div>
            <div className="field-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className={`input-wrap ${errors.password ? "invalid" : ""}`}>
                <LockKeyhole size={19} />
                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type={visible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onBlur={() => validateField("password")}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrors((previous) => ({
                      ...previous,
                      password: undefined,
                    }));
                    setMessage("");
                  }}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  className="icon-button"
                  aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  aria-pressed={visible}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              {errors.password && (
                <p className="field-error" id="password-error" role="alert">
                  {errors.password}
                </p>
              )}
            </div>
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
                onClick={() => setDialog(information.forgot)}
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
          <p className="signup">
            Bạn chưa có tài khoản?{" "}
            <button
              className="text-button"
              onClick={() => setDialog(information.register)}
            >
              Đăng ký tài khoản <ArrowUpRight size={15} />
            </button>
          </p>
        </section>
      </div>
      <InfoDialog content={dialog} onClose={() => setDialog(null)} />
    </main>
  );
}
