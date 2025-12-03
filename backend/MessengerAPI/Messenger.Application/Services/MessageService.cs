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

