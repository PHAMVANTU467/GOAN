using Goan.Api.Application.Contracts;
using Goan.Api.Application.Dtos.Auth;
using Goan.Api.Domain.Entities;
using Goan.Api.Domain.Exceptions;

namespace Goan.Api.Application.Services;

public sealed class AuthService(
    IUserRepository userRepository,
    IPasswordService passwordService) : IAuthService
{
    public async Task<AuthResponse> LoginAsync(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        var identifier = NormalizeIdentifier(request.Identifier);
        var account = await userRepository.FindByIdentifierAsync(identifier, cancellationToken);

        if (account is null || !passwordService.Verify(account, request.Password))
        {
            throw new InvalidCredentialsException();
        }

        return new AuthResponse(account.Id, account.FullName, "Đăng nhập thành công.");
    }

    public async Task<AuthResponse> RegisterAsync(
        RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var account = new UserAccount
        {
            FullName = request.FullName.Trim(),
            Phone = NormalizePhone(request.Phone),
            Email = request.Email.Trim().ToLowerInvariant(),
            Username = request.Username.Trim().ToLowerInvariant(),
            PasswordHash = string.Empty,
        };

        account.PasswordHash = passwordService.Hash(account, request.Password);

        if (!await userRepository.TryAddAsync(account, cancellationToken))
        {
            throw new DuplicateAccountException(
                "Email, số điện thoại hoặc tên đăng nhập đã được sử dụng.");
        }

        return new AuthResponse(
            account.Id,
            account.FullName,
            "Đăng ký thành công. Bạn có thể quay lại đăng nhập.");
    }

    private static string NormalizeIdentifier(string value)
    {
        var trimmedValue = value.Trim();
        return trimmedValue.Contains('@')
            ? trimmedValue.ToLowerInvariant()
            : NormalizePhone(trimmedValue);
    }

    private static string NormalizePhone(string value) =>
        value.Replace(" ", string.Empty)
            .Replace(".", string.Empty)
            .Replace("-", string.Empty);
}
