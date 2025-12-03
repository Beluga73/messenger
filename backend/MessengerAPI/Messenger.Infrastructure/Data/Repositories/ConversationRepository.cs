using Messenger.Application.Interfaces;
using Messenger.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Messenger.Infrastructure.Data.Repositories;

public class ConversationRepository(MessengerDbContext context) : IConversationRepository
{
    public async Task<Conversation?> GetConversationByIdAsync(Guid conversationId)
    {
        return await context.Set<Conversation>()
            .Include(c => c.User1)
            .Include(c => c.User2)
            .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
            .ThenInclude(m => m.Sender)
            .FirstOrDefaultAsync(c => c.Id == conversationId);
    }

    public async Task<Conversation?> GetConversationByUsersAsync(Guid user1Id, Guid user2Id)
    {
        return await context.Set<Conversation>()
            .Include(c => c.User1)
            .Include(c => c.User2)
            .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
            .ThenInclude(m => m.Sender)
            .FirstOrDefaultAsync(c => 
                (c.User1Id == user1Id && c.User2Id == user2Id) ||
                (c.User1Id == user2Id && c.User2Id == user1Id));
    }

    public async Task<Conversation> CreateConversationAsync(Conversation conversation)
    {
        var entry = await context.Set<Conversation>().AddAsync(conversation);
        await context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task<List<Conversation>> GetConversationsByUserIdAsync(Guid userId)
    {
        return await context.Set<Conversation>()
            .Include(c => c.User1)
            .Include(c => c.User2)
            .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
            .ThenInclude(m => m.Sender)
            .Where(c => c.User1Id == userId || c.User2Id == userId)
            .OrderByDescending(c => c.LastMessageAt)
            .ToListAsync();
    }

    public async Task UpdateConversationAsync(Conversation conversation)
    {
        context.Set<Conversation>().Update(conversation);
        await context.SaveChangesAsync();
    }
}

