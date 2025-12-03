using Messenger.Domain.Entities;

namespace Messenger.Application.Dtos;

public class ConversationDto
{
    public Guid Id { get; set; }
    public Guid User1Id { get; set; }
    public string User1Name { get; set; }
    public string User1AvatarUrl { get; set; }
    public Guid User2Id { get; set; }
    public string User2Name { get; set; }
    public string User2AvatarUrl { get; set; }
    public MessageDto? LastMessage { get; set; }
    public DateTime LastMessageAt { get; set; }
    public int UnreadCount { get; set; }

    public ConversationDto(Conversation conversation, Guid currentUserId)
    {
        Id = conversation.Id;
        User1Id = conversation.User1Id;
        User1Name = conversation.User1.Name ?? conversation.User1.Username;
        User1AvatarUrl = conversation.User1.AvatarUrl;
        User2Id = conversation.User2Id;
        User2Name = conversation.User2.Name ?? conversation.User2.Username;
        User2AvatarUrl = conversation.User2.AvatarUrl;
        LastMessageAt = conversation.LastMessageAt;
        
        var lastMessage = conversation.Messages.OrderByDescending(m => m.SentAt).FirstOrDefault();
        if (lastMessage != null)
        {
            LastMessage = new MessageDto(lastMessage);
        }
        
        UnreadCount = conversation.Messages.Count(m => !m.IsRead && m.SenderId != currentUserId);
    }
}

