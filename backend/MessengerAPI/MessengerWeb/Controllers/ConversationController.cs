using System.Security.Claims;
using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MessengerWeb.Controllers;

[Authorize]
[ApiController]
[Route("api/conversations")]
public class ConversationController(IMessageService messageService) : ControllerBase
{
    [HttpGet]
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
    
    [HttpPost]
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
    
    [HttpPost]
    [Route("start")]
    public async Task<IActionResult> StartConversation([FromBody] StartConversationDto startConversationDto)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                    ?? throw new Exception("User not authenticated"));
            var conversation = await messageService.StartConversationAsync(userId, startConversationDto.TargetUserId);
            return Ok(conversation);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [HttpGet]
    [Route("{conversationId}")]
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
}