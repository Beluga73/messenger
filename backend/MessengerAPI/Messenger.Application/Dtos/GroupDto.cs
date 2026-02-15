using Messenger.Domain.Entities;

namespace Messenger.Application.Dtos;

public class GroupDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string AvatarUrl { get; set; }
    public Guid CreatorId { get; set; }
    public string CreatorName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastMessageAt { get; set; }
    public int MemberCount { get; set; }
    public List<GroupMemberDto> Members { get; set; } = new();
    public GroupMessageDto? LastMessage { get; set; }

    public GroupDto(Group group)
    {
        Id = group.Id;
        Name = group.Name;
        Description = group.Description;
        AvatarUrl = group.AvatarUrl;
        CreatorId = group.CreatorId;
        CreatorName = group.Creator?.Name ?? group.Creator?.Username ?? "Unknown";
        CreatedAt = group.CreatedAt;
        LastMessageAt = group.LastMessageAt;
        MemberCount = group.Members?.Count ?? 0;
        Members = group.Members?.Select(m => new GroupMemberDto(m)).ToList() ?? new();
        
        var lastMessage = group.Messages?.OrderByDescending(m => m.SentAt).FirstOrDefault();
        if (lastMessage != null)
        {
            LastMessage = new GroupMessageDto(lastMessage);
        }
    }
}
