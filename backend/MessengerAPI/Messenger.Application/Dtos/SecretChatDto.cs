using Messenger.Domain.Entities;

namespace Messenger.Application.Dtos;

/// <summary>
/// DTO for a secret chat — includes key exchange info and status 
/// </summary>
public class SecretChatDto
{
    public Guid Id { get; set; }
    public Guid InitiatorId { get; set; }
    public string InitiatorName { get; set; }
    public string InitiatorAvatarUrl { get; set; }
    public Guid ParticipantId { get; set; }
    public string ParticipantName { get; set; }
    public string ParticipantAvatarUrl { get; set; }
    
    /// <summary>
    /// The other user's public key for ECDH key derivation (for the requesting user)
    /// </summary>
    public string? OtherUserPublicKey { get; set; }
    
    public string Status { get; set; }
    public int SelfDestructSeconds { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? KeyExchangeCompletedAt { get; set; }
    public SecretMessageDto? LastMessage { get; set; }
    public int UnreadCount { get; set; }

    public SecretChatDto(SecretChat chat, Guid currentUserId)
    {
        Id = chat.Id;
        InitiatorId = chat.InitiatorId;
        InitiatorName = chat.Initiator.Name ?? chat.Initiator.Username;
        InitiatorAvatarUrl = chat.Initiator.AvatarUrl;
        ParticipantId = chat.ParticipantId;
        ParticipantName = chat.Participant.Name ?? chat.Participant.Username;
        ParticipantAvatarUrl = chat.Participant.AvatarUrl;
        Status = chat.Status.ToString();
        SelfDestructSeconds = chat.SelfDestructSeconds;
        CreatedAt = chat.CreatedAt;
        KeyExchangeCompletedAt = chat.KeyExchangeCompletedAt;
        
        // Provide the OTHER user's public key to the requesting user
        if (currentUserId == chat.InitiatorId)
            OtherUserPublicKey = chat.ParticipantPublicKey;
        else
            OtherUserPublicKey = chat.InitiatorPublicKey;
        
        var lastMessage = chat.Messages
            .Where(m => !m.IsDestroyed)
            .OrderByDescending(m => m.SentAt)
            .FirstOrDefault();
        if (lastMessage != null)
            LastMessage = new SecretMessageDto(lastMessage);
        
        UnreadCount = chat.Messages.Count(m => !m.IsRead && m.SenderId != currentUserId && !m.IsDestroyed);
    }
}
