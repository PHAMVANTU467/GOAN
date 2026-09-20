using System.ComponentModel.DataAnnotations;

namespace Goan.Api.Application.Dtos.Auth;

public sealed class RegisterRequest
{
    [Required(ErrorMessage = "Vui lòng nhập họ và tên.")]
    [MinLength(2, ErrorMessage = "Họ và tên phải có ít nhất 2 ký tự.")]
    public required string FullName { get; init; }

    [Required(ErrorMessage = "Vui lòng nhập số điện thoại.")]
    [RegularExpression(@"^(?:0|\+84)[35789]\d{8}$", ErrorMessage = "Số điện thoại chưa hợp lệ.")]
    public required string Phone { get; init; }

    [Required(ErrorMessage = "Vui lòng nhập email.")]
    [EmailAddress(ErrorMessage = "Email chưa hợp lệ.")]
    public required string Email { get; init; }

    [Required(ErrorMessage = "Vui lòng nhập tên đăng nhập.")]
    [RegularExpression(@"^[a-zA-Z0-9._]{4,30}$", ErrorMessage = "Tên đăng nhập gồm 4–30 ký tự: chữ, số, dấu chấm hoặc gạch dưới.")]
    public required string Username { get; init; }

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu.")]
    [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d).{8,}$", ErrorMessage = "Mật khẩu cần ít nhất 8 ký tự, gồm chữ và số.")]
    public required string Password { get; init; }
}
