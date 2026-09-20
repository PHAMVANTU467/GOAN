using Goan.Api.Domain.Entities;

namespace Goan.Api.Application.Contracts;

public interface IUserRepository
{
    Task<UserAccount?> FindByIdentifierAsync(string identifier, CancellationToken cancellationToken);
    Task<bool> TryAddAsync(UserAccount account, CancellationToken cancellationToken);
}
