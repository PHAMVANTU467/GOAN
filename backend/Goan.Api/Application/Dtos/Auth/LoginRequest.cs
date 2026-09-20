using System.ComponentModel.DataAnnotations;

namespace Goan.Api.Application.Dtos.Auth;

public sealed class LoginRequest
{
    [Required(ErrorMessage = "Vui lòng nhập tên đăng nhập, email hoặc số điện thoại.")]
    public required string Identifier { get; init; }

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu.")]
    public required string Password { get; init; }
}
