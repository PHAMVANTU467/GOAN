import { describe, expect, it } from "vitest";
import { RegistrationValidator } from "./RegistrationValidator";
import { RegistrationRequestMapper } from "./RegistrationRequestMapper";
import type { RegistrationFormValues } from "../domain/AuthModels";

const validForm: RegistrationFormValues = {
  fullName: "Phạm Văn Tú",
  phone: "0912 345 678",
  email: "owner@goan.vn",
  username: "owner.goan",
  password: "goan2026",
  confirmPassword: "goan2026",
};

describe("RegistrationValidator", () => {
  it("accepts a complete valid registration", () => {
    expect(RegistrationValidator.validate(validForm)).toEqual({});
  });

  it("reports every required field", () => {
    expect(
      Object.keys(
        RegistrationValidator.validate({
          fullName: "",
          phone: "",
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
        }),
      ),
    ).toEqual([
      "fullName",
      "phone",
      "email",
      "username",
      "password",
      "confirmPassword",
    ]);
  });

  it.each(["owner@", "owner@goan", "owner goan.vn"])(
    "rejects invalid email %s",
    (email) => {
      expect(
        RegistrationValidator.validate({ ...validForm, email }).email,
      ).toBe("Email chưa hợp lệ.");
    },
  );

  it.each(["ad", "user-name", "abc", "tênđăngnhập"])(
    "rejects invalid username %s",
    (username) => {
      expect(
        RegistrationValidator.validate({ ...validForm, username }).username,
      ).toBeTruthy();
    },
  );

  it("rejects weak and mismatched passwords", () => {
    expect(
      RegistrationValidator.validate({
        ...validForm,
        password: "password",
        confirmPassword: "different",
      }),
    ).toMatchObject({
      password: "Mật khẩu cần ít nhất 8 ký tự, gồm chữ và số.",
      confirmPassword: "Mật khẩu xác nhận không khớp.",
    });
  });
});

describe("RegistrationRequestMapper", () => {
  it("normalizes user data and excludes password confirmation", () => {
    expect(
      RegistrationRequestMapper.fromForm({
        ...validForm,
        fullName: "  Phạm Văn Tú  ",
        phone: "0912.345.678",
        email: " OWNER@GOAN.VN ",
        username: " owner.goan ",
      }),
    ).toEqual({
      fullName: "Phạm Văn Tú",
      phone: "0912345678",
      email: "owner@goan.vn",
      username: "owner.goan",
      password: "goan2026",
    });
  });
});
