using Messenger.Application.Dtos;

namespace Messenger.Application.Interfaces;

public interface IGroupService
{
    Task<GroupDto> CreateGroupAsync(Guid creatorId, CreateGroupDto dto);
    Task<GroupDto> GetGroupAsync(Guid groupId, Guid userId);
    Task<List<GroupDto>> GetUserGroupsAsync(Guid userId);
    Task<GroupDto> UpdateGroupAsync(Guid groupId, Guid userId, UpdateGroupDto dto);
    Task DeleteGroupAsync(Guid groupId, Guid userId);
    Task<GroupDto> AddMembersAsync(Guid groupId, Guid userId, AddGroupMembersDto dto);
    Task RemoveMemberAsync(Guid groupId, Guid userId, Guid memberUserId);
    Task LeaveGroupAsync(Guid groupId, Guid userId);
    Task<GroupMessageDto> SendMessageAsync(Guid senderId, SendGroupMessageDto dto);
    Task<List<GroupMessageDto>> GetMessagesAsync(Guid groupId, Guid userId, int skip = 0, int take = 50);
}
