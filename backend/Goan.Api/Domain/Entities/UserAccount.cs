namespace Goan.Api.Domain.Entities;

public sealed class UserAccount
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public required string FullName { get; init; }
    public required string Phone { get; init; }
    public required string Email { get; init; }
    public required string Username { get; init; }
    public required string PasswordHash { get; set; }
    public DateTimeOffset CreatedAtUtc { get; init; } = DateTimeOffset.UtcNow;
}
