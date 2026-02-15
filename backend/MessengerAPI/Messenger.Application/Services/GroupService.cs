using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;
using Messenger.Domain.Entities;

namespace Messenger.Application.Services;

public class GroupService : IGroupService
{
    private readonly IGroupRepository _groupRepository;
    private readonly IGroupMessageRepository _groupMessageRepository;
    private readonly IUserRepository _userRepository;

    public GroupService(
        IGroupRepository groupRepository,
        IGroupMessageRepository groupMessageRepository,
        IUserRepository userRepository)
    {
        _groupRepository = groupRepository;
        _groupMessageRepository = groupMessageRepository;
        _userRepository = userRepository;
    }

    public async Task<GroupDto> CreateGroupAsync(Guid creatorId, CreateGroupDto dto)
    {
        var creator = await _userRepository.GetUserByIdAsync(creatorId)
                      ?? throw new Exception("Creator not found");

        var group = new Group
        {
            Name = dto.Name,
            Description = dto.Description,
            CreatorId = creatorId,
            Creator = creator
        };

        group = await _groupRepository.CreateGroupAsync(group);

        // Add creator as Admin
        var creatorMember = new GroupMember
        {
            GroupId = group.Id,
            Group = group,
            UserId = creatorId,
            User = creator,
            Role = GroupRole.Admin
        };
        await _groupRepository.AddGroupMemberAsync(creatorMember);

        // Add other members
        foreach (var memberId in dto.MemberIds.Where(id => id != creatorId).Distinct())
        {
            var user = await _userRepository.GetUserByIdAsync(memberId);
            if (user == null) continue;

            var member = new GroupMember
            {
                GroupId = group.Id,
                Group = group,
                UserId = memberId,
                User = user,
                Role = GroupRole.Member
            };
            await _groupRepository.AddGroupMemberAsync(member);
        }

        // Reload group with all relations
        group = await _groupRepository.GetGroupByIdAsync(group.Id)
                ?? throw new Exception("Failed to retrieve created group");

        return new GroupDto(group);
    }

    public async Task<GroupDto> GetGroupAsync(Guid groupId, Guid userId)
    {
        var group = await _groupRepository.GetGroupByIdAsync(groupId)
                    ?? throw new Exception("Group not found");

        var member = await _groupRepository.GetGroupMemberAsync(groupId, userId);
        if (member == null)
            throw new Exception("Unauthorized access to group");

        return new GroupDto(group);
    }

    public async Task<List<GroupDto>> GetUserGroupsAsync(Guid userId)
    {
        var groups = await _groupRepository.GetGroupsByUserIdAsync(userId);
        return groups.Select(g => new GroupDto(g)).ToList();
    }

    public async Task<GroupDto> UpdateGroupAsync(Guid groupId, Guid userId, UpdateGroupDto dto)
    {
        var group = await _groupRepository.GetGroupByIdAsync(groupId)
                    ?? throw new Exception("Group not found");

        var member = await _groupRepository.GetGroupMemberAsync(groupId, userId);
        if (member == null || member.Role != GroupRole.Admin)
            throw new Exception("Only group admins can update the group");

        if (dto.Name != null)
            group.Name = dto.Name;
        if (dto.Description != null)
            group.Description = dto.Description;

        await _groupRepository.UpdateGroupAsync(group);

        group = await _groupRepository.GetGroupByIdAsync(groupId)
                ?? throw new Exception("Failed to retrieve updated group");

        return new GroupDto(group);
    }

    public async Task DeleteGroupAsync(Guid groupId, Guid userId)
    {
        var group = await _groupRepository.GetGroupByIdAsync(groupId)
                    ?? throw new Exception("Group not found");

        if (group.CreatorId != userId)
            throw new Exception("Only the group creator can delete the group");

        await _groupRepository.DeleteGroupAsync(groupId);
    }

    public async Task<GroupDto> AddMembersAsync(Guid groupId, Guid userId, AddGroupMembersDto dto)
    {
        var group = await _groupRepository.GetGroupByIdAsync(groupId)
                    ?? throw new Exception("Group not found");

        var requester = await _groupRepository.GetGroupMemberAsync(groupId, userId);
        if (requester == null || requester.Role != GroupRole.Admin)
            throw new Exception("Only group admins can add members");

        foreach (var memberId in dto.MemberIds.Distinct())
        {
            // Skip if already a member
            var existingMember = await _groupRepository.GetGroupMemberAsync(groupId, memberId);
            if (existingMember != null) continue;

            var user = await _userRepository.GetUserByIdAsync(memberId);
            if (user == null) continue;

            var member = new GroupMember
            {
                GroupId = groupId,
                Group = group,
                UserId = memberId,
                User = user,
                Role = GroupRole.Member
            };
            await _groupRepository.AddGroupMemberAsync(member);
        }

        group = await _groupRepository.GetGroupByIdAsync(groupId)
                ?? throw new Exception("Failed to retrieve updated group");

        return new GroupDto(group);
    }

    public async Task RemoveMemberAsync(Guid groupId, Guid userId, Guid memberUserId)
    {
        var group = await _groupRepository.GetGroupByIdAsync(groupId)
                    ?? throw new Exception("Group not found");

        var requester = await _groupRepository.GetGroupMemberAsync(groupId, userId);
        if (requester == null || requester.Role != GroupRole.Admin)
            throw new Exception("Only group admins can remove members");

        if (memberUserId == group.CreatorId)
            throw new Exception("Cannot remove the group creator");

        var member = await _groupRepository.GetGroupMemberAsync(groupId, memberUserId);
        if (member == null)
            throw new Exception("User is not a member of this group");

        await _groupRepository.RemoveGroupMemberAsync(groupId, memberUserId);
    }

    public async Task LeaveGroupAsync(Guid groupId, Guid userId)
    {
        var group = await _groupRepository.GetGroupByIdAsync(groupId)
                    ?? throw new Exception("Group not found");

        if (userId == group.CreatorId)
            throw new Exception("The group creator cannot leave. Delete the group instead.");

        var member = await _groupRepository.GetGroupMemberAsync(groupId, userId);
        if (member == null)
            throw new Exception("You are not a member of this group");

        await _groupRepository.RemoveGroupMemberAsync(groupId, userId);
    }

    public async Task<GroupMessageDto> SendMessageAsync(Guid senderId, SendGroupMessageDto dto)
    {
        var sender = await _userRepository.GetUserByIdAsync(senderId)
                     ?? throw new Exception("Sender not found");

        var group = await _groupRepository.GetGroupByIdAsync(dto.GroupId)
                    ?? throw new Exception("Group not found");

        var member = await _groupRepository.GetGroupMemberAsync(dto.GroupId, senderId);
        if (member == null)
            throw new Exception("You are not a member of this group");

        var message = new GroupMessage
        {
            GroupId = dto.GroupId,
            Group = group,
            SenderId = senderId,
            Sender = sender,
            Content = dto.Content,
            SentAt = DateTime.UtcNow
        };

        message = await _groupMessageRepository.CreateMessageAsync(message);

        // Update group last message time
        group.LastMessageAt = DateTime.UtcNow;
        await _groupRepository.UpdateGroupAsync(group);

        // Reload with sender
        message = await _groupMessageRepository.GetMessageByIdAsync(message.Id)
                  ?? throw new Exception("Failed to retrieve created message");

        return new GroupMessageDto(message);
    }

    public async Task<List<GroupMessageDto>> GetMessagesAsync(Guid groupId, Guid userId, int skip = 0, int take = 50)
    {
        var member = await _groupRepository.GetGroupMemberAsync(groupId, userId);
        if (member == null)
            throw new Exception("Unauthorized access to group");

        var messages = await _groupMessageRepository.GetMessagesByGroupIdAsync(groupId, skip, take);
        return messages.Select(m => new GroupMessageDto(m)).Reverse().ToList();
    }
}
