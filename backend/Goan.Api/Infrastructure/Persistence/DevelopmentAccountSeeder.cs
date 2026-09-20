using Goan.Api.Application.Contracts;
using Goan.Api.Domain.Entities;

namespace Goan.Api.Infrastructure.Persistence;

public static class DevelopmentAccountSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
        var passwords = scope.ServiceProvider.GetRequiredService<IPasswordService>();
        var account = new UserAccount
        {
            FullName = "Quản trị GOAN",
            Email = "admin@goan.local",
            Phone = "0900000000",
            Username = "admin",
            PasswordHash = string.Empty,
        };
        account.PasswordHash = passwords.Hash(account, "123456");
        await repository.TryAddAsync(account, CancellationToken.None);
    }
}
