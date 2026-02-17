namespace Messenger.Application.Dtos;

/// <summary>
/// DTO at initiate an E2E secret chat
/// </summary>
public class InitiateSecretChatDto
{
    /// <summary>
    /// Target user to start a secret chat with
    /// </summary>
    public Guid TargetUserId { get; set; }
    
    /// <summary>
    /// Initiator's ECDH public key (Base64-encoded)
    /// </summary>
    public string PublicKey { get; set; } = string.Empty;
    
    /// <summary>
    /// Optional self-destruct timer in seconds (0 = disabled)
    /// </summary>
    public int SelfDestructSeconds { get; set; } = 0;
}

/// <summary>
/// DTO to accept a secret chat invitation and provide the participant's public key
/// </summary>
public class AcceptSecretChatDto
{
    /// <summary>
    /// Participant's ECDH public key (Base64-encoded)
    /// </summary>
    public string PublicKey { get; set; } = string.Empty;
}

/// <summary>
/// DTO to send an E2E encrypted message in a secret chat
/// </summary>
public class SendSecretMessageDto
{
    /// <summary>
    /// Base64-encoded ciphertext (encrypted on the client)
    /// </summary>
    public string EncryptedContent { get; set; } = string.Empty;
    
    /// <summary>
    /// Base64-encoded IV used for encryption
    /// </summary>
    public string Iv { get; set; } = string.Empty;
    
    /// <summary>
    /// Base64-encoded HMAC for message authentication
    /// </summary>
    public string? Hmac { get; set; }
}
