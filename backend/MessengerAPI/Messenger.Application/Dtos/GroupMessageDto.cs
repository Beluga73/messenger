using Messenger.Domain.Entities;

namespace Messenger.Application.Dtos;

public class GroupMessageDto
{
    public Guid Id { get; set; }
    public Guid GroupId { get; set; }
    public Guid SenderId { get; set; }
    public string SenderName { get; set; }
    public string SenderAvatarUrl { get; set; }
    public string Content { get; set; }
    public DateTime SentAt { get; set; }

    public GroupMessageDto(GroupMessage message)
    {
        Id = message.Id;
        GroupId = message.GroupId;
        SenderId = message.SenderId;
        SenderName = message.Sender?.Name ?? message.Sender?.Username ?? "Unknown";
        SenderAvatarUrl = message.Sender?.AvatarUrl ?? "";
        Content = message.Content;
        SentAt = message.SentAt;
    }
}
