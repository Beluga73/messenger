using Messenger.Domain.Entities;

namespace Messenger.Application.Dtos;

public class GroupMemberDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; }
    public string UserAvatarUrl { get; set; }
    public string Role { get; set; }
    public DateTime JoinedAt { get; set; }

    public GroupMemberDto(GroupMember member)
    {
        Id = member.Id;
        UserId = member.UserId;
        UserName = member.User?.Name ?? member.User?.Username ?? "Unknown";
        UserAvatarUrl = member.User?.AvatarUrl ?? "";
        Role = member.Role.ToString();
        JoinedAt = member.JoinedAt;
    }
}
