using Messenger.Domain.Entities;

namespace Messenger.Application.Interfaces;

public interface IConversationRepository
{
    Task<Conversation?> GetConversationByIdAsync(Guid conversationId);
    Task<Conversation?> GetConversationByUsersAsync(Guid user1Id, Guid user2Id);
    Task<Conversation> CreateConversationAsync(Conversation conversation);
    Task<List<Conversation>> GetConversationsByUserIdAsync(Guid userId);
    Task UpdateConversationAsync(Conversation conversation);
}

