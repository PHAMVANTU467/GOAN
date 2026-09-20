import type {
  RegistrationFormValues,
  RegistrationRequest,
} from "../domain/AuthModels";

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
