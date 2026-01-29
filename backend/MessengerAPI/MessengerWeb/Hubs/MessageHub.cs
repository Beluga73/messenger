using System.Security.Claims;
using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MessengerWeb.Hubs;

[Authorize]
public class MessageHub : Hub
{
    private readonly IMessageService _messageService;

    public MessageHub(IMessageService messageService)
    {
        _messageService = messageService;
    }

    private Guid GetUserId()
    {
        var userIdString = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdString == null)
            throw new HubException("User not authenticated");
        return Guid.Parse(userIdString);
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId != null)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId != null)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
        }
        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Send a message to a recipient
    /// </summary>
    public async Task SendMessage(CreateMessageDto messageDto)
    {
        try
        {
            var senderId = GetUserId();
            var message = await _messageService.SendMessageAsync(senderId, messageDto);
            
            // Notify the conversation group (chat window update)
            // Было: "ReceiveMessage"
            await Clients.Group($"conversation_{message.ConversationId}")
                .SendAsync("conversation:message:received", message);
            
            // Notify the specific user (global notification/toast)
            // Было: "NewMessage"
            await Clients.Group($"user_{messageDto.RecipientId}")
                .SendAsync("user:message:notification", message);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to send message: {ex.Message}");
        }
    }

    /// <summary>
    /// Load messages for a conversation
    /// </summary>
    public async Task LoadMessages(Guid conversationId, int skip = 0, int take = 50)
    {
        try
        {
            var userId = GetUserId();
            var messages = await _messageService.GetMessagesAsync(conversationId, userId, skip, take);
            
            // Было: "MessagesLoaded"
            await Clients.Caller.SendAsync("conversation:messages:loaded", messages);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to load messages: {ex.Message}");
        }
    }

    /// <summary>
    /// Load all conversations for the current user
    /// </summary>
    public async Task LoadConversations()
    {
        try
        {
            var userId = GetUserId();
            var conversations = await _messageService.GetConversationsAsync(userId);
            
            // Было: "ConversationsLoaded"
            await Clients.Caller.SendAsync("user:conversations:loaded", conversations);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to load conversations: {ex.Message}");
        }
    }

    /// <summary>
    /// Mark messages as read in a conversation
    /// </summary>
    public async Task MarkAsRead(Guid conversationId)
    {
        try
        {
            var userId = GetUserId();
            await _messageService.MarkAsReadAsync(conversationId, userId);
            
            // Notify all users in the conversation
            // Было: "MessagesRead"
            await Clients.Group($"conversation_{conversationId}")
                .SendAsync("conversation:messages:read", conversationId, userId);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to mark messages as read: {ex.Message}");
        }
    }

    /// <summary>
    /// Join a conversation group
    /// </summary>
    public async Task JoinConversation(Guid conversationId)
    {
        try
        {
            var userId = GetUserId();
            
            // Verify user has access to this conversation
            var conversations = await _messageService.GetConversationsAsync(userId);
            if (!conversations.Any(c => c.Id == conversationId))
            {
                throw new HubException("Unauthorized access to conversation");
            }
            
            await Groups.AddToGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
            
            // Notify others that user joined
            // Было: "UserJoinedConversation"
            await Clients.Group($"conversation_{conversationId}")
                .SendAsync("conversation:user:joined", userId, Context.ConnectionId);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to join conversation: {ex.Message}");
        }
    }

    /// <summary>
    /// Leave a conversation group
    /// </summary>
    public async Task LeaveConversation(Guid conversationId)
    {
        try
        {
            var userId = GetUserId();
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
            
            // Было: "UserLeftConversation"
            await Clients.Group($"conversation_{conversationId}")
                .SendAsync("conversation:user:left", userId, Context.ConnectionId);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to leave conversation: {ex.Message}");
        }
    }
}