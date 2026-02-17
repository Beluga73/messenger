using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;
using Messenger.Domain.Entities;

namespace Messenger.Application.Services;

/// <summary>
/// Service for managing end-to-end encrypted secret chats.
/// The server acts as a relay — it facilitates key exchange and stores ciphertext without decrypting.
/// </summary>
public class SecretChatService : ISecretChatService
{
    private readonly ISecretChatRepository _secretChatRepository;
    private readonly IUserRepository _userRepository;

    public SecretChatService(
        ISecretChatRepository secretChatRepository,
        IUserRepository userRepository)
    {
        _secretChatRepository = secretChatRepository;
        _userRepository = userRepository;
    }

    public async Task<SecretChatDto> InitiateSecretChatAsync(Guid initiatorId, InitiateSecretChatDto dto)
    {
        if (initiatorId == dto.TargetUserId)
            throw new Exception("Cannot start a secret chat with yourself");

        var initiator = await _userRepository.GetUserByIdAsync(initiatorId)
                        ?? throw new Exception("Initiator not found");
        var participant = await _userRepository.GetUserByIdAsync(dto.TargetUserId)
                          ?? throw new Exception("Target user not found");

        // Check if active secret chat already exists between these users
        var existing = await _secretChatRepository.GetSecretChatByUsersAsync(initiatorId, dto.TargetUserId);
        if (existing != null && existing.Status != SecretChatStatus.Closed)
            throw new Exception("An active secret chat already exists between these users");

        var secretChat = new SecretChat
        {
            InitiatorId = initiatorId,
            Initiator = initiator,
            ParticipantId = dto.TargetUserId,
            Participant = participant,
            InitiatorPublicKey = dto.PublicKey,
            SelfDestructSeconds = dto.SelfDestructSeconds,
            Status = SecretChatStatus.PendingKeyExchange
        };

        secretChat = await _secretChatRepository.CreateSecretChatAsync(secretChat);
        return new SecretChatDto(secretChat, initiatorId);
    }

    public async Task<SecretChatDto> AcceptSecretChatAsync(Guid participantId, Guid secretChatId, AcceptSecretChatDto dto)
    {
        var secretChat = await _secretChatRepository.GetSecretChatByIdAsync(secretChatId)
                         ?? throw new Exception("Secret chat not found");

        if (secretChat.ParticipantId != participantId)
            throw new Exception("Only the invited participant can accept this secret chat");

        if (secretChat.Status != SecretChatStatus.PendingKeyExchange)
            throw new Exception("Secret chat is not pending key exchange");

        secretChat.ParticipantPublicKey = dto.PublicKey;
        secretChat.Status = SecretChatStatus.Active;
        secretChat.KeyExchangeCompletedAt = DateTime.UtcNow;

        await _secretChatRepository.UpdateSecretChatAsync(secretChat);
        return new SecretChatDto(secretChat, participantId);
    }

    public async Task CloseSecretChatAsync(Guid userId, Guid secretChatId)
    {
        var secretChat = await _secretChatRepository.GetSecretChatByIdAsync(secretChatId)
                         ?? throw new Exception("Secret chat not found");

        if (secretChat.InitiatorId != userId && secretChat.ParticipantId != userId)
            throw new Exception("Unauthorized access to secret chat");

        secretChat.Status = SecretChatStatus.Closed;
        // Clear keys on close for forward secrecy
        secretChat.InitiatorPublicKey = null;
        secretChat.ParticipantPublicKey = null;

        await _secretChatRepository.UpdateSecretChatAsync(secretChat);
    }

    public async Task<SecretChatDto> GetSecretChatAsync(Guid userId, Guid secretChatId)
    {
        var secretChat = await _secretChatRepository.GetSecretChatByIdAsync(secretChatId)
                         ?? throw new Exception("Secret chat not found");

        if (secretChat.InitiatorId != userId && secretChat.ParticipantId != userId)
            throw new Exception("Unauthorized access to secret chat");

        return new SecretChatDto(secretChat, userId);
    }

    public async Task<List<SecretChatDto>> GetUserSecretChatsAsync(Guid userId)
    {
        var chats = await _secretChatRepository.GetSecretChatsByUserIdAsync(userId);
        return chats.Select(c => new SecretChatDto(c, userId)).ToList();
    }

    public async Task<SecretMessageDto> SendSecretMessageAsync(Guid senderId, Guid secretChatId, SendSecretMessageDto dto)
    {
        var secretChat = await _secretChatRepository.GetSecretChatByIdAsync(secretChatId)
                         ?? throw new Exception("Secret chat not found");

        if (secretChat.InitiatorId != senderId && secretChat.ParticipantId != senderId)
            throw new Exception("Unauthorized access to secret chat");

        if (secretChat.Status != SecretChatStatus.Active)
            throw new Exception("Secret chat is not active — key exchange must be completed first");

        var sender = await _userRepository.GetUserByIdAsync(senderId)
                     ?? throw new Exception("Sender not found");

        var message = new SecretMessage
        {
            SecretChatId = secretChatId,
            SecretChat = secretChat,
            SenderId = senderId,
            Sender = sender,
            EncryptedContent = dto.EncryptedContent,
            Iv = dto.Iv,
            Hmac = dto.Hmac,
            SentAt = DateTime.UtcNow
        };

        // Set self-destruct timer if configured
        if (secretChat.SelfDestructSeconds > 0)
        {
            message.ExpiresAt = DateTime.UtcNow.AddSeconds(secretChat.SelfDestructSeconds);
        }

        message = await _secretChatRepository.CreateSecretMessageAsync(message);
        return new SecretMessageDto(message);
    }

    public async Task<List<SecretMessageDto>> GetSecretMessagesAsync(Guid userId, Guid secretChatId, int skip = 0, int take = 50)
    {
        var secretChat = await _secretChatRepository.GetSecretChatByIdAsync(secretChatId)
                         ?? throw new Exception("Secret chat not found");

        if (secretChat.InitiatorId != userId && secretChat.ParticipantId != userId)
            throw new Exception("Unauthorized access to secret chat");

        var messages = await _secretChatRepository.GetSecretMessagesByChatIdAsync(secretChatId, skip, take);
        return messages.Select(m => new SecretMessageDto(m)).Reverse().ToList();
    }

    public async Task MarkSecretMessagesAsReadAsync(Guid userId, Guid secretChatId)
    {
        var secretChat = await _secretChatRepository.GetSecretChatByIdAsync(secretChatId)
                         ?? throw new Exception("Secret chat not found");

        if (secretChat.InitiatorId != userId && secretChat.ParticipantId != userId)
            throw new Exception("Unauthorized access to secret chat");

        await _secretChatRepository.MarkSecretMessagesAsReadAsync(secretChatId, userId);
    }

    public async Task DestroyExpiredMessagesAsync()
    {
        await _secretChatRepository.DestroyExpiredMessagesAsync();
    }
}
