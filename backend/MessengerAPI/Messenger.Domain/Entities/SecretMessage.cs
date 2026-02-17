using System.ComponentModel.DataAnnotations;

namespace Messenger.Domain.Entities;

/// <summary>
/// A message within a SecretChat. Content is always end-to-end encrypted ciphertext.
/// The server never decrypts these messages.
/// </summary>
public class SecretMessage : BaseEntity
{
    [Required]
    public Guid SecretChatId { get; set; }
    
    [Required]
    public SecretChat SecretChat { get; set; }
    
    [Required]
    public Guid SenderId { get; set; }
    
    [Required]
    public User Sender { get; set; }
    
    /// <summary>
    /// The encrypted content (Base64-encoded ciphertext). 
    /// Server stores this as-is without decryption.
    /// </summary>
    [Required]
    public string EncryptedContent { get; set; }
    
    /// <summary>
    /// Initialization vector used for this message's encryption (Base64-encoded)
    /// </summary>
    [Required]
    public string Iv { get; set; }
    
    /// <summary>
    /// HMAC of the ciphertext for message authentication (Base64-encoded)
    /// </summary>
    public string? Hmac { get; set; }
    
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    
    public bool IsRead { get; set; } = false;
    
    public DateTime? ReadAt { get; set; }
    
    /// <summary>
    /// When this message should self-destruct (null = no self-destruct)
    /// </summary>
    public DateTime? ExpiresAt { get; set; }
    
    /// <summary>
    /// Whether this message has been self-destructed
    /// </summary>
    public bool IsDestroyed { get; set; } = false;
}
