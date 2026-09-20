using Goan.Api.Application.Contracts;
using Goan.Api.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Goan.Api.Infrastructure.Security;

public sealed class PasswordService : IPasswordService
{
    private readonly PasswordHasher<UserAccount> _hasher = new();

    public string Hash(UserAccount account, string password) =>
        _hasher.HashPassword(account, password);

    public bool Verify(UserAccount account, string password)
    {
        var result = _hasher.VerifyHashedPassword(account, account.PasswordHash, password);
        return result is PasswordVerificationResult.Success or
            PasswordVerificationResult.SuccessRehashNeeded;
    }
}
