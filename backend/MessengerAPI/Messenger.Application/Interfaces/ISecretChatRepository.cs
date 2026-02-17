using Messenger.Domain.Entities;

namespace Messenger.Application.Interfaces;

public interface ISecretChatRepository
{
    Task<SecretChat> CreateSecretChatAsync(SecretChat secretChat);
    Task<SecretChat?> GetSecretChatByIdAsync(Guid secretChatId);
    Task<SecretChat?> GetSecretChatByUsersAsync(Guid user1Id, Guid user2Id);
    Task<List<SecretChat>> GetSecretChatsByUserIdAsync(Guid userId);
    Task UpdateSecretChatAsync(SecretChat secretChat);
    Task<SecretMessage> CreateSecretMessageAsync(SecretMessage message);
    Task<List<SecretMessage>> GetSecretMessagesByChatIdAsync(Guid secretChatId, int skip = 0, int take = 50);
    Task MarkSecretMessagesAsReadAsync(Guid secretChatId, Guid userId);
    Task DestroyExpiredMessagesAsync();
    Task<int> GetUnreadSecretMessageCountAsync(Guid secretChatId, Guid userId);
}
