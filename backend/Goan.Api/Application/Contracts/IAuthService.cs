using Goan.Api.Application.Dtos.Auth;

namespace Goan.Api.Application.Contracts;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken);
}
