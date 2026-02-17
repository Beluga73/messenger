using Messenger.Domain.Entities;

namespace Messenger.Application.Dtos;

/// <summary>
/// DTO for an E2E encrypted message — server stores only ciphertext
/// </summary>
public class SecretMessageDto
{
    public Guid Id { get; set; }
    public Guid SecretChatId { get; set; }
    public Guid SenderId { get; set; }
    public string SenderName { get; set; }
    
    /// <summary>
    /// Base64-encoded ciphertext — decryption happens on the client
    /// </summary>
    public string EncryptedContent { get; set; }
    
    /// <summary>
    /// Base64-encoded IV for decryption
    /// </summary>
    public string Iv { get; set; }
    
    /// <summary>
    /// Base64-encoded HMAC for message authentication
    /// </summary>
    public string? Hmac { get; set; }
    
    public DateTime SentAt { get; set; }
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime? ExpiresAt { get; set; }

    public SecretMessageDto(SecretMessage message)
    {
        Id = message.Id;
        SecretChatId = message.SecretChatId;
        SenderId = message.SenderId;
        SenderName = message.Sender.Name ?? message.Sender.Username;
        EncryptedContent = message.EncryptedContent;
        Iv = message.Iv;
        Hmac = message.Hmac;
        SentAt = message.SentAt;
        IsRead = message.IsRead;
        ReadAt = message.ReadAt;
        ExpiresAt = message.ExpiresAt;
    }
}
