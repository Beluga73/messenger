using Messenger.Application.Dtos;

namespace Messenger.Application.Interfaces;

/// <summary>
/// Service for managing end-to-end encrypted secret chats.
/// The server facilitates key exchange and relays encrypted messages but never sees plaintext.
/// </summary>
public interface ISecretChatService
{
    /// <summary>
    /// Initiate a new secret chat with a target user. The initiator provides their public key.
    /// </summary>
    Task<SecretChatDto> InitiateSecretChatAsync(Guid initiatorId, InitiateSecretChatDto dto);
    
    /// <summary>
    /// Accept a secret chat invitation and provide the participant's public key.
    /// </summary>
    Task<SecretChatDto> AcceptSecretChatAsync(Guid participantId, Guid secretChatId, AcceptSecretChatDto dto);
    
    /// <summary>
    /// Decline/close a secret chat.
    /// </summary>
    Task CloseSecretChatAsync(Guid userId, Guid secretChatId);
    
    /// <summary>
    /// Get a secret chat by ID (only if user is a participant).
    /// </summary>
    Task<SecretChatDto> GetSecretChatAsync(Guid userId, Guid secretChatId);
    
    /// <summary>
    /// Get all secret chats for a user.
    /// </summary>
    Task<List<SecretChatDto>> GetUserSecretChatsAsync(Guid userId);
    
    /// <summary>
    /// Send an encrypted message in a secret chat. The server stores the ciphertext as-is.
    /// </summary>
    Task<SecretMessageDto> SendSecretMessageAsync(Guid senderId, Guid secretChatId, SendSecretMessageDto dto);
    
    /// <summary>
    /// Get encrypted messages for a secret chat (paginated).
    /// </summary>
    Task<List<SecretMessageDto>> GetSecretMessagesAsync(Guid userId, Guid secretChatId, int skip = 0, int take = 50);
    
    /// <summary>
    /// Mark secret messages as read.
    /// </summary>
    Task MarkSecretMessagesAsReadAsync(Guid userId, Guid secretChatId);
    
    /// <summary>
    /// Destroy expired self-destruct messages.
    /// </summary>
    Task DestroyExpiredMessagesAsync();
}
