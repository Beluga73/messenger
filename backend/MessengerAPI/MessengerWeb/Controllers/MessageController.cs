using System.Security.Claims;
using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MessengerWeb.Controllers;

[Authorize]
[ApiController]
[Route("api/messages")]
public class MessageController(IMessageService messageService) : ControllerBase
{
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

    [HttpGet]
    [Route("conversations/{conversationId}")]
    public async Task<IActionResult> GetConversation(Guid conversationId)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                    ?? throw new Exception("User not authenticated"));
            var conversation = await messageService.GetConversationAsync(conversationId, userId);
            return Ok(conversation);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost]
    [Route("conversations")]
    public async Task<IActionResult> CreateConversation([FromBody] CreateConversationDto conversationDto)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                    ?? throw new Exception("User not authenticated"));
            var conversation = await messageService.CreateConversationAsync(userId, conversationDto);
            return Ok(conversation);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}

