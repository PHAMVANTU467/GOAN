namespace Goan.Api.Domain.Exceptions;

public sealed class InvalidCredentialsException()
    : Exception("Email, số điện thoại hoặc mật khẩu không chính xác.");
