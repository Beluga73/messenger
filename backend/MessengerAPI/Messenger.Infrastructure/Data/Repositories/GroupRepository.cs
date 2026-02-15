using Messenger.Application.Interfaces;
using Messenger.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Messenger.Infrastructure.Data.Repositories;

public class GroupRepository(MessengerDbContext context) : IGroupRepository
{
    public async Task<Group?> GetGroupByIdAsync(Guid groupId)
    {
        return await context.Set<Group>()
            .Include(g => g.Creator)
            .Include(g => g.Members)
            .ThenInclude(m => m.User)
            .Include(g => g.Messages.OrderByDescending(m => m.SentAt).Take(1))
            .ThenInclude(m => m.Sender)
            .FirstOrDefaultAsync(g => g.Id == groupId);
    }

    public async Task<Group> CreateGroupAsync(Group group)
    {
        var entry = await context.Set<Group>().AddAsync(group);
        await context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task UpdateGroupAsync(Group group)
    {
        context.Set<Group>().Update(group);
        await context.SaveChangesAsync();
    }

    public async Task DeleteGroupAsync(Guid groupId)
    {
        var group = await context.Set<Group>().FindAsync(groupId);
        if (group != null)
        {
            context.Set<Group>().Remove(group);
            await context.SaveChangesAsync();
        }
    }

    public async Task<List<Group>> GetGroupsByUserIdAsync(Guid userId)
    {
        return await context.Set<Group>()
            .Include(g => g.Creator)
            .Include(g => g.Members)
            .ThenInclude(m => m.User)
            .Include(g => g.Messages.OrderByDescending(m => m.SentAt).Take(1))
            .ThenInclude(m => m.Sender)
            .Where(g => g.Members.Any(m => m.UserId == userId))
            .OrderByDescending(g => g.LastMessageAt)
            .ToListAsync();
    }

    public async Task<GroupMember?> GetGroupMemberAsync(Guid groupId, Guid userId)
    {
        return await context.Set<GroupMember>()
            .Include(gm => gm.User)
            .FirstOrDefaultAsync(gm => gm.GroupId == groupId && gm.UserId == userId);
    }

    public async Task<List<GroupMember>> GetGroupMembersAsync(Guid groupId)
    {
        return await context.Set<GroupMember>()
            .Include(gm => gm.User)
            .Where(gm => gm.GroupId == groupId)
            .OrderBy(gm => gm.JoinedAt)
            .ToListAsync();
    }

    public async Task AddGroupMemberAsync(GroupMember member)
    {
        await context.Set<GroupMember>().AddAsync(member);
        await context.SaveChangesAsync();
    }

    public async Task RemoveGroupMemberAsync(Guid groupId, Guid userId)
    {
        var member = await context.Set<GroupMember>()
            .FirstOrDefaultAsync(gm => gm.GroupId == groupId && gm.UserId == userId);
        if (member != null)
        {
            context.Set<GroupMember>().Remove(member);
            await context.SaveChangesAsync();
        }
    }

    public async Task UpdateGroupMemberAsync(GroupMember member)
    {
        context.Set<GroupMember>().Update(member);
        await context.SaveChangesAsync();
    }
}
