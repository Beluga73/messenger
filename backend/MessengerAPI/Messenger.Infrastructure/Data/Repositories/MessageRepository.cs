using Messenger.Application.Interfaces;
using Messenger.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Messenger.Infrastructure.Data.Repositories;

public class MessageRepository(MessengerDbContext context) : IMessageRepository
{
    public async Task<Message> CreateMessageAsync(Message message)
    {
        var entry = await context.Set<Message>().AddAsync(message);
        await context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task<List<Message>> GetMessagesByConversationIdAsync(Guid conversationId, int skip = 0, int take = 50)
    {
        return await context.Set<Message>()
            .Include(m => m.Sender)
            .Where(m => m.ConversationId == conversationId)
            .OrderByDescending(m => m.SentAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }

    public async Task<Message?> GetMessageByIdAsync(Guid messageId)
    {
        return await context.Set<Message>()
            .Include(m => m.Sender)
            .FirstOrDefaultAsync(m => m.Id == messageId);
    }

    public async Task MarkMessagesAsReadAsync(Guid conversationId, Guid userId)
    {
        var messages = await context.Set<Message>()
            .Where(m => m.ConversationId == conversationId 
                        && m.SenderId != userId 
                        && !m.IsRead)
            .ToListAsync();

        foreach (var message in messages)
        {
            message.IsRead = true;
            message.ReadAt = DateTime.UtcNow;
        }

        await context.SaveChangesAsync();
    }

    public async Task<int> GetUnreadCountAsync(Guid conversationId, Guid userId)
    {
        return await context.Set<Message>()
            .CountAsync(m => m.ConversationId == conversationId 
                            && m.SenderId != userId 
                            && !m.IsRead);
    }
}

