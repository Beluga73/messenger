using System.Security.Claims;
using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MessengerWeb.Controllers;

/// <summary>
/// DEPRECATED: Use SignalR MessageHub instead.
/// This controller is maintained for backward compatibility only.
/// All messaging operations have been migrated to real-time SignalR communication.
/// </summary>
[Authorize]
[ApiController]
[Route("api/messages")]
[Obsolete("Use SignalR MessageHub at /hubs/messages instead")]
public class MessageController(IMessageService messageService) : ControllerBase
{
    /// <summary>
    /// DEPRECATED: Use MessageHub.SendMessage() via SignalR instead.
    /// Get messages from a conversation
    /// </summary>
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
    /// DEPRECATED: Use MessageHub.LoadConversations() via SignalR instead.
    /// Get all conversations for the current user
    /// </summary>
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
}

