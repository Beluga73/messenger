using Messenger.Application.Interfaces;
using Messenger.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Messenger.Infrastructure.Data.Repositories;

public class SecretChatRepository(MessengerDbContext context) : ISecretChatRepository
{
    public async Task<SecretChat> CreateSecretChatAsync(SecretChat secretChat)
    {
        var entry = await context.Set<SecretChat>().AddAsync(secretChat);
        await context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task<SecretChat?> GetSecretChatByIdAsync(Guid secretChatId)
    {
        return await context.Set<SecretChat>()
            .Include(sc => sc.Initiator)
            .Include(sc => sc.Participant)
            .Include(sc => sc.Messages
                .Where(m => !m.IsDestroyed)
                .OrderByDescending(m => m.SentAt)
                .Take(1))
            .ThenInclude(m => m.Sender)
            .FirstOrDefaultAsync(sc => sc.Id == secretChatId);
    }

    public async Task<SecretChat?> GetSecretChatByUsersAsync(Guid user1Id, Guid user2Id)
    {
        return await context.Set<SecretChat>()
            .Include(sc => sc.Initiator)
            .Include(sc => sc.Participant)
            .Include(sc => sc.Messages
                .Where(m => !m.IsDestroyed)
                .OrderByDescending(m => m.SentAt)
                .Take(1))
            .ThenInclude(m => m.Sender)
            .FirstOrDefaultAsync(sc =>
                ((sc.InitiatorId == user1Id && sc.ParticipantId == user2Id) ||
                 (sc.InitiatorId == user2Id && sc.ParticipantId == user1Id)) &&
                sc.Status != SecretChatStatus.Closed);
    }

    public async Task<List<SecretChat>> GetSecretChatsByUserIdAsync(Guid userId)
    {
        return await context.Set<SecretChat>()
            .Include(sc => sc.Initiator)
            .Include(sc => sc.Participant)
            .Include(sc => sc.Messages
                .Where(m => !m.IsDestroyed)
                .OrderByDescending(m => m.SentAt)
                .Take(1))
            .ThenInclude(m => m.Sender)
            .Where(sc => (sc.InitiatorId == userId || sc.ParticipantId == userId) 
                         && sc.Status != SecretChatStatus.Closed)
            .OrderByDescending(sc => sc.CreatedAt)
            .ToListAsync();
    }

    public async Task UpdateSecretChatAsync(SecretChat secretChat)
    {
        context.Set<SecretChat>().Update(secretChat);
        await context.SaveChangesAsync();
    }

    public async Task<SecretMessage> CreateSecretMessageAsync(SecretMessage message)
    {
        var entry = await context.Set<SecretMessage>().AddAsync(message);
        await context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task<List<SecretMessage>> GetSecretMessagesByChatIdAsync(Guid secretChatId, int skip = 0, int take = 50)
    {
        return await context.Set<SecretMessage>()
            .Include(m => m.Sender)
            .Where(m => m.SecretChatId == secretChatId && !m.IsDestroyed)
            .OrderByDescending(m => m.SentAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }

    public async Task MarkSecretMessagesAsReadAsync(Guid secretChatId, Guid userId)
    {
        var messages = await context.Set<SecretMessage>()
            .Where(m => m.SecretChatId == secretChatId
                        && m.SenderId != userId
                        && !m.IsRead
                        && !m.IsDestroyed)
            .ToListAsync();

        foreach (var message in messages)
        {
            message.IsRead = true;
            message.ReadAt = DateTime.UtcNow;
        }

        await context.SaveChangesAsync();
    }

    public async Task DestroyExpiredMessagesAsync()
    {
        var expiredMessages = await context.Set<SecretMessage>()
            .Where(m => m.ExpiresAt != null 
                        && m.ExpiresAt <= DateTime.UtcNow 
                        && !m.IsDestroyed)
            .ToListAsync();

        foreach (var message in expiredMessages)
        {
            message.IsDestroyed = true;
            message.EncryptedContent = string.Empty;
            message.Iv = string.Empty;
            message.Hmac = null;
        }

        await context.SaveChangesAsync();
    }

    public async Task<int> GetUnreadSecretMessageCountAsync(Guid secretChatId, Guid userId)
    {
        return await context.Set<SecretMessage>()
            .CountAsync(m => m.SecretChatId == secretChatId
                             && m.SenderId != userId
                             && !m.IsRead
                             && !m.IsDestroyed);
    }
}
