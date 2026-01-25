using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;
using Messenger.Domain.Entities;

namespace Messenger.Application.Services;

public class MessageService : IMessageService
{
    private readonly IMessageRepository _messageRepository;
    private readonly IConversationRepository _conversationRepository;
    private readonly IUserRepository _userRepository;

    public MessageService(
        IMessageRepository messageRepository,
        IConversationRepository conversationRepository,
        IUserRepository userRepository)
    {
        _messageRepository = messageRepository;
        _conversationRepository = conversationRepository;
        _userRepository = userRepository;
    }

    public async Task<MessageDto> SendMessageAsync(Guid senderId, CreateMessageDto messageDto)
    {
        var sender = await _userRepository.GetUserByIdAsync(senderId);
        if (sender == null)
            throw new Exception("Sender not found");

        var recipient = await _userRepository.GetUserByIdAsync(messageDto.RecipientId);
        if (recipient == null)
            throw new Exception("Recipient not found");

        if (senderId == messageDto.RecipientId)
            throw new Exception("Cannot send message to yourself");

        // Get or create conversation
        var conversation = await _conversationRepository.GetConversationByUsersAsync(senderId, messageDto.RecipientId);
        
        if (conversation == null)
        {
            conversation = new Conversation
            {
                User1Id = senderId,
                User1 = sender,
                User2Id = messageDto.RecipientId,
                User2 = recipient
            };
            conversation = await _conversationRepository.CreateConversationAsync(conversation);
        }

        // Create message
        var message = new Message
        {
            ConversationId = conversation.Id,
            Conversation = conversation,
            SenderId = senderId,
            Sender = sender,
            Content = messageDto.Content,
            SentAt = DateTime.UtcNow
        };

        message = await _messageRepository.CreateMessageAsync(message);

        // Update conversation last message time
        conversation.LastMessageAt = DateTime.UtcNow;
        await _conversationRepository.UpdateConversationAsync(conversation);

        // Reload message with sender
        message = await _messageRepository.GetMessageByIdAsync(message.Id) 
                  ?? throw new Exception("Failed to retrieve created message");

        return new MessageDto(message);
    }

    public async Task<List<MessageDto>> GetMessagesAsync(Guid conversationId, Guid userId, int skip = 0, int take = 50)
    {
        var conversation = await _conversationRepository.GetConversationByIdAsync(conversationId);
        if (conversation == null)
            throw new Exception("Conversation not found");

        if (conversation.User1Id != userId && conversation.User2Id != userId)
            throw new Exception("Unauthorized access to conversation");

        var messages = await _messageRepository.GetMessagesByConversationIdAsync(conversationId, skip, take);
        return messages.Select(m => new MessageDto(m)).Reverse().ToList();
    }

    public async Task<List<ConversationDto>> GetConversationsAsync(Guid userId)
    {
        var conversations = await _conversationRepository.GetConversationsByUserIdAsync(userId);
        return conversations.Select(c => new ConversationDto(c, userId)).ToList();
    }

    public async Task<ConversationDto> GetConversationAsync(Guid conversationId, Guid userId)
    {
        var conversation = await _conversationRepository.GetConversationByIdAsync(conversationId);
        if (conversation == null)
            throw new Exception("Conversation not found");

        if (conversation.User1Id != userId && conversation.User2Id != userId)
            throw new Exception("Unauthorized access to conversation");

        return new ConversationDto(conversation, userId);
    }

    public async Task<ConversationDto> CreateConversationAsync(Guid creatorId, CreateConversationDto conversationDto)
    {
        if (conversationDto.ParticipantIds.Count != 2 || conversationDto.IsGroup)
            throw new Exception("Only 1-on-1 conversations are currently supported");

        if (!conversationDto.ParticipantIds.Contains(creatorId))
            throw new Exception("Creator must be a participant");

        var user1Id = creatorId;
        var user2Id = conversationDto.ParticipantIds.First(id => id != creatorId);

        // Check if conversation already exists
        var existingConversation = await _conversationRepository.GetConversationByUsersAsync(user1Id, user2Id);
        if (existingConversation != null)
            throw new Exception("Conversation already exists");

        var user1 = await _userRepository.GetUserByIdAsync(user1Id) ?? throw new Exception("Creator not found");
        var user2 = await _userRepository.GetUserByIdAsync(user2Id) ?? throw new Exception("Participant not found");

        var conversation = new Conversation
        {
            User1Id = user1Id,
            User1 = user1,
            User2Id = user2Id,
            User2 = user2
        };

        conversation = await _conversationRepository.CreateConversationAsync(conversation);

        return new ConversationDto(conversation, creatorId);
    }

    public async Task<ConversationDto> StartConversationAsync(Guid userId, Guid targetUserId)
    {
        if (userId == targetUserId)
            throw new Exception("Cannot start conversation with yourself");

        // Check if conversation already exists
        var existingConversation = await _conversationRepository.GetConversationByUsersAsync(userId, targetUserId);
        if (existingConversation != null)
        {
            return new ConversationDto(existingConversation, userId);
        }

        var user = await _userRepository.GetUserByIdAsync(userId) ?? throw new Exception("User not found");
        var targetUser = await _userRepository.GetUserByIdAsync(targetUserId) ?? throw new Exception("Target user not found");

        var conversation = new Conversation
        {
            User1Id = userId,
            User1 = user,
            User2Id = targetUserId,
            User2 = targetUser,
            LastMessageAt = DateTime.UtcNow
        };

        conversation = await _conversationRepository.CreateConversationAsync(conversation);

        return new ConversationDto(conversation, userId);
    }

    public async Task MarkAsReadAsync(Guid conversationId, Guid userId)
    {
        var conversation = await _conversationRepository.GetConversationByIdAsync(conversationId);
        if (conversation == null)
            throw new Exception("Conversation not found");

        if (conversation.User1Id != userId && conversation.User2Id != userId)
            throw new Exception("Unauthorized access to conversation");

        await _messageRepository.MarkMessagesAsReadAsync(conversationId, userId);
    }
}

