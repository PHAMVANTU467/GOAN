namespace Goan.Api.Application.Dtos.Auth;

public sealed record AuthResponse(Guid UserId, string FullName, string Message);
