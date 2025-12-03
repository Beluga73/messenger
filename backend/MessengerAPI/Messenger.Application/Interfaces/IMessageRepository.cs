using Messenger.Domain.Entities;

namespace Messenger.Application.Interfaces;

public interface IMessageRepository
{
    Task<Message> CreateMessageAsync(Message message);
    Task<List<Message>> GetMessagesByConversationIdAsync(Guid conversationId, int skip = 0, int take = 50);
    Task<Message?> GetMessageByIdAsync(Guid messageId);
    Task MarkMessagesAsReadAsync(Guid conversationId, Guid userId);
    Task<int> GetUnreadCountAsync(Guid conversationId, Guid userId);
}

