using Goan.Api.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Goan.Api.Presentation.Middleware;

public sealed class ExceptionHandlingMiddleware(
    RequestDelegate next,
    ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            await WriteProblemAsync(context, exception);
        }
    }

    private async Task WriteProblemAsync(HttpContext context, Exception exception)
    {
        var statusCode = exception switch
        {
            InvalidCredentialsException => StatusCodes.Status401Unauthorized,
            DuplicateAccountException => StatusCodes.Status409Conflict,
            _ => StatusCodes.Status500InternalServerError,
        };

        if (statusCode == StatusCodes.Status500InternalServerError)
        {
            logger.LogError(exception, "Unhandled request error");
        }

        var detail = statusCode == StatusCodes.Status500InternalServerError
            ? "Máy chủ gặp lỗi. Vui lòng thử lại sau."
            : exception.Message;

        context.Response.StatusCode = statusCode;
        await context.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = statusCode,
            Title = "Không thể xử lý yêu cầu",
            Detail = detail,
        });
    }
}
