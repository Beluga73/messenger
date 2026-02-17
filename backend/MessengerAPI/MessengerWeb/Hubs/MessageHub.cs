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
    private readonly IGroupService _groupService;
    private readonly ISecretChatService _secretChatService;

    public MessageHub(IMessageService messageService, IGroupService groupService, ISecretChatService secretChatService)
    {
        _messageService = messageService;
        _groupService = groupService;
        _secretChatService = secretChatService;
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

    // ==================== Direct Messages ====================

    /// <summary>
    /// Send a message to a recipient
    /// </summary>
    public async Task SendMessage(CreateMessageDto messageDto)
    {
        try
        {
            var senderId = GetUserId();
            var message = await _messageService.SendMessageAsync(senderId, messageDto);
            
            await Clients.Group($"conversation_{message.ConversationId}")
                .SendAsync("conversation:message:received", message);
            
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
            
            var conversations = await _messageService.GetConversationsAsync(userId);
            if (!conversations.Any(c => c.Id == conversationId))
            {
                throw new HubException("Unauthorized access to conversation");
            }
            
            await Groups.AddToGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
            
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
            
            await Clients.Group($"conversation_{conversationId}")
                .SendAsync("conversation:user:left", userId, Context.ConnectionId);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to leave conversation: {ex.Message}");
        }
    }

    // ==================== Group Messages ====================

    /// <summary>
    /// Send a message to a group
    /// </summary>
    public async Task SendGroupMessage(SendGroupMessageDto messageDto)
    {
        try
        {
            var senderId = GetUserId();
            var message = await _groupService.SendMessageAsync(senderId, messageDto);
            
            // Notify all members in the group SignalR group
            await Clients.Group($"group_{messageDto.GroupId}")
                .SendAsync("group:message:received", message);
            
            // Notify individual members who may not be in the group SignalR group
            var group = await _groupService.GetGroupAsync(messageDto.GroupId, senderId);
            foreach (var member in group.Members)
            {
                if (member.UserId != senderId)
                {
                    await Clients.Group($"user_{member.UserId}")
                        .SendAsync("user:group:message:notification", message, group.Name);
                }
            }
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to send group message: {ex.Message}");
        }
    }

    /// <summary>
    /// Load messages for a group
    /// </summary>
    public async Task LoadGroupMessages(Guid groupId, int skip = 0, int take = 50)
    {
        try
        {
            var userId = GetUserId();
            var messages = await _groupService.GetMessagesAsync(groupId, userId, skip, take);
            
            await Clients.Caller.SendAsync("group:messages:loaded", messages);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to load group messages: {ex.Message}");
        }
    }

    /// <summary>
    /// Load all groups for the current user
    /// </summary>
    public async Task LoadGroups()
    {
        try
        {
            var userId = GetUserId();
            var groups = await _groupService.GetUserGroupsAsync(userId);
            
            await Clients.Caller.SendAsync("user:groups:loaded", groups);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to load groups: {ex.Message}");
        }
    }

    /// <summary>
    /// Join a group SignalR group for real-time updates
    /// </summary>
    public async Task JoinGroup(Guid groupId)
    {
        try
        {
            var userId = GetUserId();
            
            // Verify membership
            await _groupService.GetGroupAsync(groupId, userId);
            
            await Groups.AddToGroupAsync(Context.ConnectionId, $"group_{groupId}");
            
            await Clients.Group($"group_{groupId}")
                .SendAsync("group:user:joined", userId, Context.ConnectionId);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to join group: {ex.Message}");
        }
    }

    /// <summary>
    /// Leave a group SignalR group
    /// </summary>
    public async Task LeaveGroupHub(Guid groupId)
    {
        try
        {
            var userId = GetUserId();
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"group_{groupId}");
            
            await Clients.Group($"group_{groupId}")
                .SendAsync("group:user:left", userId, Context.ConnectionId);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to leave group: {ex.Message}");
        }
    }

    // ==================== Secret Chats (E2E Encrypted) ====================

    /// <summary>
    /// Send an E2E encrypted message in a secret chat.
    /// The server relays the ciphertext without decrypting.
    /// </summary>
    public async Task SendSecretMessage(Guid secretChatId, SendSecretMessageDto messageDto)
    {
        try
        {
            var senderId = GetUserId();
            var message = await _secretChatService.SendSecretMessageAsync(senderId, secretChatId, messageDto);

            // Notify both participants in the secret chat SignalR group
            await Clients.Group($"secret_{secretChatId}")
                .SendAsync("secret:message:received", message);

            // Get the chat to notify the other user
            var chat = await _secretChatService.GetSecretChatAsync(senderId, secretChatId);
            var otherUserId = chat.InitiatorId == senderId ? chat.ParticipantId : chat.InitiatorId;

            await Clients.Group($"user_{otherUserId}")
                .SendAsync("user:secret:message:notification", message, secretChatId);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to send secret message: {ex.Message}");
        }
    }

    /// <summary>
    /// Load encrypted messages for a secret chat
    /// </summary>
    public async Task LoadSecretMessages(Guid secretChatId, int skip = 0, int take = 50)
    {
        try
        {
            var userId = GetUserId();
            var messages = await _secretChatService.GetSecretMessagesAsync(userId, secretChatId, skip, take);

            await Clients.Caller.SendAsync("secret:messages:loaded", messages);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to load secret messages: {ex.Message}");
        }
    }

    /// <summary>
    /// Load all secret chats for the current user
    /// </summary>
    public async Task LoadSecretChats()
    {
        try
        {
            var userId = GetUserId();
            var chats = await _secretChatService.GetUserSecretChatsAsync(userId);

            await Clients.Caller.SendAsync("user:secret-chats:loaded", chats);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to load secret chats: {ex.Message}");
        }
    }

    /// <summary>
    /// Join a secret chat SignalR group for real-time updates
    /// </summary>
    public async Task JoinSecretChat(Guid secretChatId)
    {
        try
        {
            var userId = GetUserId();

            // Verify participation
            await _secretChatService.GetSecretChatAsync(userId, secretChatId);

            await Groups.AddToGroupAsync(Context.ConnectionId, $"secret_{secretChatId}");

            await Clients.Group($"secret_{secretChatId}")
                .SendAsync("secret:user:joined", userId, Context.ConnectionId);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to join secret chat: {ex.Message}");
        }
    }

    /// <summary>
    /// Leave a secret chat SignalR group
    /// </summary>
    public async Task LeaveSecretChat(Guid secretChatId)
    {
        try
        {
            var userId = GetUserId();
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"secret_{secretChatId}");

            await Clients.Group($"secret_{secretChatId}")
                .SendAsync("secret:user:left", userId, Context.ConnectionId);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to leave secret chat: {ex.Message}");
        }
    }

    /// <summary>
    /// Mark secret chat messages as read
    /// </summary>
    public async Task MarkSecretAsRead(Guid secretChatId)
    {
        try
        {
            var userId = GetUserId();
            await _secretChatService.MarkSecretMessagesAsReadAsync(userId, secretChatId);

            await Clients.Group($"secret_{secretChatId}")
                .SendAsync("secret:messages:read", secretChatId, userId);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to mark secret messages as read: {ex.Message}");
        }
    }

    /// <summary>
    /// Notify that a secret chat key exchange has been completed
    /// </summary>
    public async Task NotifyKeyExchangeComplete(Guid secretChatId)
    {
        try
        {
            var userId = GetUserId();
            var chat = await _secretChatService.GetSecretChatAsync(userId, secretChatId);

            var otherUserId = chat.InitiatorId == userId ? chat.ParticipantId : chat.InitiatorId;
            
            await Clients.Group($"user_{otherUserId}")
                .SendAsync("secret:key-exchange:completed", chat);
            
            await Clients.Group($"secret_{secretChatId}")
                .SendAsync("secret:status:updated", chat);
        }
        catch (Exception ex)
        {
            throw new HubException($"Failed to notify key exchange: {ex.Message}");
        }
    }
}