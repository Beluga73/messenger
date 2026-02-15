using Messenger.Application.Interfaces;
using Messenger.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Messenger.Infrastructure.Data.Repositories;

public class GroupMessageRepository(MessengerDbContext context) : IGroupMessageRepository
{
    public async Task<GroupMessage> CreateMessageAsync(GroupMessage message)
    {
        var entry = await context.Set<GroupMessage>().AddAsync(message);
        await context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task<List<GroupMessage>> GetMessagesByGroupIdAsync(Guid groupId, int skip = 0, int take = 50)
    {
        return await context.Set<GroupMessage>()
            .Include(m => m.Sender)
            .Where(m => m.GroupId == groupId)
            .OrderByDescending(m => m.SentAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }

    public async Task<GroupMessage?> GetMessageByIdAsync(Guid messageId)
    {
        return await context.Set<GroupMessage>()
            .Include(m => m.Sender)
            .FirstOrDefaultAsync(m => m.Id == messageId);
    }
}
