using Messenger.Domain.Entities;

namespace Messenger.Application.Dtos;

public class ConversationDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; }
    public string UserAvatarUrl { get; set; }
    public MessageDto? LastMessage { get; set; }
    public DateTime LastMessageAt { get; set; }
    public int UnreadCount { get; set; }

    public ConversationDto(Conversation conversation, Guid currentUserId)
    {
        Id = conversation.Id;
        LastMessageAt = conversation.LastMessageAt;
        
        // Determine which user is the "other" user (not the current user)
        if (conversation.User1Id == currentUserId)
        {
            UserId = conversation.User2Id;
            UserName = conversation.User2.Name ?? conversation.User2.Username;
            UserAvatarUrl = conversation.User2.AvatarUrl;
        }
        else
        {
            UserId = conversation.User1Id;
            UserName = conversation.User1.Name ?? conversation.User1.Username;
            UserAvatarUrl = conversation.User1.AvatarUrl;
        }
        
        var lastMessage = conversation.Messages.OrderByDescending(m => m.SentAt).FirstOrDefault();
        if (lastMessage != null)
        {
            LastMessage = new MessageDto(lastMessage);
        }
        
        UnreadCount = conversation.Messages.Count(m => !m.IsRead && m.SenderId != currentUserId);
    }
}