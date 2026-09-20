using Goan.Api.Domain.Entities;

namespace Goan.Api.Application.Contracts;

public interface IPasswordService
{
    string Hash(UserAccount account, string password);
    bool Verify(UserAccount account, string password);
}
