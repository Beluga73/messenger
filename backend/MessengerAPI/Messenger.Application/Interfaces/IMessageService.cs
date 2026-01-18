using Messenger.Application.Dtos;

namespace Messenger.Application.Interfaces;

public interface IMessageService
{
    Task<MessageDto> SendMessageAsync(Guid senderId, CreateMessageDto messageDto);
    Task<List<MessageDto>> GetMessagesAsync(Guid conversationId, Guid userId, int skip = 0, int take = 50);
    Task<List<ConversationDto>> GetConversationsAsync(Guid userId);
    Task<ConversationDto> GetConversationAsync(Guid conversationId, Guid userId);
    Task<ConversationDto> CreateConversationAsync(Guid creatorId, CreateConversationDto conversationDto);
    Task MarkAsReadAsync(Guid conversationId, Guid userId);
}

