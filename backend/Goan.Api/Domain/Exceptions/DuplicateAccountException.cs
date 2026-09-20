namespace Goan.Api.Domain.Exceptions;

public sealed class DuplicateAccountException(string message) : Exception(message);
