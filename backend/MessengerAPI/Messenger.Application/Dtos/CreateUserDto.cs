namespace Messenger.Application.Dtos;

public record CreateUserDto(string? Username, string Password, string Code, string PhoneNumber);