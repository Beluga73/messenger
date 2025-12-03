using Messenger.Domain.Entities;

namespace Messenger.Application.Dtos;

public class MessageDto
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public Guid SenderId { get; set; }
    public string SenderName { get; set; }
    public string Content { get; set; }
    public DateTime SentAt { get; set; }
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }

    public MessageDto(Message message)
    {
        Id = message.Id;
        ConversationId = message.ConversationId;
        SenderId = message.SenderId;
        SenderName = message.Sender.Name ?? message.Sender.Username;
        Content = message.Content;
        SentAt = message.SentAt;
        IsRead = message.IsRead;
        ReadAt = message.ReadAt;
    }
}

