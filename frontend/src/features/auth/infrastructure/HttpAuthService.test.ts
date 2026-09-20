import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpAuthService } from "./HttpAuthService";

describe("HttpAuthService", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("posts registration data to the auth API", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          userId: "user-1",
          fullName: "Phạm Văn Tú",
          message: "Đăng ký thành công.",
        }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const service = new HttpAuthService("http://localhost:5080/api/");
    const request = {
      fullName: "Phạm Văn Tú",
      phone: "0912345678",
      email: "owner@goan.vn",
      username: "owner.goan",
      password: "goan2026",
    };

    await expect(service.register(request)).resolves.toMatchObject({
      userId: "user-1",
      message: "Đăng ký thành công.",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:5080/api/auth/register",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  });

  it("exposes the problem detail returned by the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ detail: "Tài khoản đã tồn tại." }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    const service = new HttpAuthService("/api");
    await expect(
      service.signIn({ identifier: "owner@goan.vn", password: "wrong" }),
    ).rejects.toThrow("Tài khoản đã tồn tại.");
  });

  it("rejects a successful response with an invalid contract", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("<html></html>", {
          status: 200,
          headers: { "Content-Type": "text/html" },
        }),
      ),
    );

    const service = new HttpAuthService("/api");
    await expect(
      service.signIn({ identifier: "owner@goan.vn", password: "goan2026" }),
    ).rejects.toThrow("không đúng định dạng");
  });
});
