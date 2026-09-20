import type { AuthService } from "../application/AuthService";
import type {
  AuthResponse,
  LoginCredentials,
  RegistrationRequest,
} from "../domain/AuthModels";

interface ApiErrorBody {
  title?: string;
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export class HttpAuthService implements AuthService {
  private readonly baseUrl: string;

  constructor(baseUrl = import.meta.env.VITE_API_URL ?? "/api") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.post<AuthResponse>("/auth/login", credentials);
  }

  register(request: RegistrationRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>("/auth/register", request);
  }

  private async post<TResponse>(
    path: string,
    body: unknown,
  ): Promise<TResponse> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseBody = (await response
      .json()
      .catch(() => ({}))) as ApiErrorBody & TResponse;

    if (!response.ok) {
      const validationMessage = responseBody.errors
        ? Object.values(responseBody.errors).flat()[0]
        : undefined;
      throw new Error(
        validationMessage ??
          responseBody.message ??
          responseBody.detail ??
          responseBody.title ??
          "Không thể kết nối đến máy chủ.",
      );
    }

    const message = responseBody.message ?? (responseBody as unknown as { Message?: string }).Message;
    if (!message) {
      throw new Error(
        "Phản hồi từ máy chủ không đúng định dạng (backend chưa sẵn sàng hoặc trả về HTML). Vui lòng đảm bảo backend đang chạy tại cổng 5080.",
      );
    }

    return responseBody;
  }
}
