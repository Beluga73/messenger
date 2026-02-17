using System.ComponentModel.DataAnnotations;

namespace Messenger.Domain.Entities;

public class GroupMessage : BaseEntity
{
    [Required]
    public Guid GroupId { get; set; }
    
    [Required]
    public Group Group { get; set; }
    
    [Required]
    public Guid SenderId { get; set; }
    
    [Required]
    public User Sender { get; set; }
    
    [Required]
    public string Content { get; set; }
    
    /// <summary>
    /// Whether this message content is encrypted at rest using server-side AES-256 encryption
    /// </summary>
    public bool IsEncrypted { get; set; } = false;
    
    /// <summary>
    /// Initialization vector for server-side AES decryption (Base64-encoded)
    /// </summary>
    public string? EncryptionIv { get; set; }
    
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}
