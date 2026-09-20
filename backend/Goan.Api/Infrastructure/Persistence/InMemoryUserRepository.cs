using Goan.Api.Application.Contracts;
using Goan.Api.Domain.Entities;

namespace Goan.Api.Infrastructure.Persistence;

public sealed class InMemoryUserRepository : IUserRepository
{
    private readonly List<UserAccount> _accounts = [];
    private readonly object _syncRoot = new();

    public Task<UserAccount?> FindByIdentifierAsync(
        string identifier,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_syncRoot)
        {
            var account = _accounts.FirstOrDefault(candidate =>
                candidate.Email.Equals(identifier, StringComparison.OrdinalIgnoreCase) ||
                candidate.Phone.Equals(identifier, StringComparison.Ordinal));
            return Task.FromResult(account);
        }
    }

    public Task<bool> TryAddAsync(
        UserAccount account,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_syncRoot)
        {
            var duplicateExists = _accounts.Any(candidate =>
                candidate.Email.Equals(account.Email, StringComparison.OrdinalIgnoreCase) ||
                candidate.Phone.Equals(account.Phone, StringComparison.Ordinal) ||
                candidate.Username.Equals(account.Username, StringComparison.OrdinalIgnoreCase));

            if (duplicateExists) return Task.FromResult(false);

            _accounts.Add(account);
            return Task.FromResult(true);
        }
    }
}
