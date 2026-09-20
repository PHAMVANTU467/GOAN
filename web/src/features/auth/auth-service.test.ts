import { describe, expect, it } from "vitest";
import { LoginValidator, UnavailableAuthService } from "./auth-service";

describe("LoginValidator", () => {
  it.each(["owner@goan.vn", "0912345678", "+84912345678", "0912 345 678"])(
    "accepts supported identifier %s",
    (identifier) => {
      expect(
        LoginValidator.validate({ identifier, password: "existing-password" }),
      ).toEqual({});
    },
  );
  it.each(["owner@", "123", "0123456789"])(
    "rejects invalid identifier %s",
    (identifier) => {
      expect(
        LoginValidator.validate({ identifier, password: "secret" }).identifier,
      ).toBeTruthy();
    },
  );
  it("reports both missing fields", () => {
    expect(
      Object.keys(LoginValidator.validate({ identifier: " ", password: "" })),
    ).toEqual(["identifier", "password"]);
  });
  it("does not impose registration password requirements at sign-in", () => {
    expect(
      LoginValidator.validate({ identifier: "owner@goan.vn", password: "abc" }),
    ).toEqual({});
  });

  describe("email identifier", () => {
    it.each([
      "owner@goan.vn",
      "owner.shop@goan.vn",
      "owner+tanphu@goan.vn",
      " OWNER@GOAN.VN ",
    ])("accepts valid email %s", (identifier) => {
      expect(
        LoginValidator.validate({ identifier, password: "password" }),
      ).toEqual({});
    });

    it.each(["owner@", "owner@goan", "owner goan.vn", "@goan.vn"])(
      "rejects invalid email %s",
      (identifier) => {
        expect(
          LoginValidator.validate({ identifier, password: "password" })
            .identifier,
        ).toBe("Email hoặc số điện thoại chưa hợp lệ.");
      },
    );
  });
});

it("never pretends authentication succeeded without a backend", async () => {
  await expect(
    new UnavailableAuthService().signIn({
      identifier: "owner@goan.vn",
      password: "secret",
    }),
  ).rejects.toThrow("chưa được kết nối");
});
