namespace Messenger.Application.Dtos;

public record CreateMessageDto(string Content, Guid RecipientId);

