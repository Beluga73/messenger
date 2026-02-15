using Messenger.Domain.Entities;

namespace Messenger.Application.Interfaces;

public interface IGroupRepository
{
    Task<Group?> GetGroupByIdAsync(Guid groupId);
    Task<Group> CreateGroupAsync(Group group);
    Task UpdateGroupAsync(Group group);
    Task DeleteGroupAsync(Guid groupId);
    Task<List<Group>> GetGroupsByUserIdAsync(Guid userId);
    Task<GroupMember?> GetGroupMemberAsync(Guid groupId, Guid userId);
    Task<List<GroupMember>> GetGroupMembersAsync(Guid groupId);
    Task AddGroupMemberAsync(GroupMember member);
    Task RemoveGroupMemberAsync(Guid groupId, Guid userId);
    Task UpdateGroupMemberAsync(GroupMember member);
}
