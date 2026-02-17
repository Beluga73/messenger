using System.ComponentModel.DataAnnotations;

namespace Messenger.Domain.Entities;

/// <summary>
/// Represents an end-to-end encrypted secret chat between two users.
/// The server stores only public keys and encrypted messages — it never sees plaintext.
/// </summary>
public class SecretChat : BaseEntity
{
    [Required]
    public User Initiator { get; set; }
    
    [Required]
    public Guid InitiatorId { get; set; }
    
    [Required]
    public User Participant { get; set; }
    
    [Required]
    public Guid ParticipantId { get; set; }
    
    /// <summary>
    /// Initiator's ECDH public key (Base64-encoded)
    /// </summary>
    public string? InitiatorPublicKey { get; set; }
    
    /// <summary>
    /// Participant's ECDH public key (Base64-encoded)
    /// </summary>
    public string? ParticipantPublicKey { get; set; }
    
    /// <summary>
    /// Whether both parties have exchanged keys and the chat is active
    /// </summary>
    public SecretChatStatus Status { get; set; } = SecretChatStatus.PendingKeyExchange;
    
    /// <summary>
    /// Optional self-destruct timer for messages (in seconds). 0 = no self-destruct.
    /// </summary>
    public int SelfDestructSeconds { get; set; } = 0;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? KeyExchangeCompletedAt { get; set; }
    
    [Required]
    public List<SecretMessage> Messages { get; set; } = new();
}

public enum SecretChatStatus
{
    PendingKeyExchange = 0,
    Active = 1,
    Closed = 2
}
