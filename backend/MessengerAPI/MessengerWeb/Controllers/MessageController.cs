using System.Security.Claims;
using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MessengerWeb.Hubs;

namespace MessengerWeb.Controllers;

[Authorize]
[ApiController]
[Route("api/messages")]
public class MessageController(IMessageService messageService, IHubContext<MessageHub> hubContext) : ControllerBase
{
    /// <summary>
    /// Send a message to another user
    /// </summary>
    /// <param name="messageDto">Message content and recipient ID</param>
    /// <returns>Created message</returns>
    [HttpPost]
    [Route("send")]
    public async Task<IActionResult> SendMessage([FromBody] CreateMessageDto messageDto)
    {
        try
        {
            var senderId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                      ?? throw new Exception("User not authenticated"));
            var message = await messageService.SendMessageAsync(senderId, messageDto);
            
            // Notify recipient via SignalR
            await hubContext.Clients.Group($"user_{messageDto.RecipientId}")
                .SendAsync("NewMessage", message);
            
            // Notify conversation group
            await hubContext.Clients.Group($"conversation_{message.ConversationId}")
                .SendAsync("MessageSent", message);
            
            return Ok(message);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Get messages from a conversation
    /// </summary>
    /// <param name="conversationId">Conversation ID</param>
    /// <param name="skip">Number of messages to skip (default: 0)</param>
    /// <param name="take">Number of messages to retrieve (default: 50)</param>
    /// <returns>List of messages</returns>
    [HttpGet]
    [Route("conversation/{conversationId}")]
    public async Task<IActionResult> GetMessages(Guid conversationId, [FromQuery] int skip = 0, [FromQuery] int take = 50)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                    ?? throw new Exception("User not authenticated"));
            var messages = await messageService.GetMessagesAsync(conversationId, userId, skip, take);
            return Ok(messages);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Get all conversations for the current user
    /// </summary>
    /// <returns>List of conversations</returns>
    [HttpGet]
    [Route("conversations")]
    public async Task<IActionResult> GetConversations()
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                    ?? throw new Exception("User not authenticated"));
            var conversations = await messageService.GetConversationsAsync(userId);
            return Ok(conversations);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Mark messages in a conversation as read
    /// </summary>
    /// <param name="conversationId">Conversation ID</param>
    /// <returns>Success status</returns>
    [HttpPost]
    [Route("conversation/{conversationId}/read")]
    public async Task<IActionResult> MarkAsRead(Guid conversationId)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                    ?? throw new Exception("User not authenticated"));
            await messageService.MarkAsReadAsync(conversationId, userId);
            
            // Notify conversation group
            await hubContext.Clients.Group($"conversation_{conversationId}")
                .SendAsync("MessagesRead", conversationId, userId);
            
            return Ok(new { success = true });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}

