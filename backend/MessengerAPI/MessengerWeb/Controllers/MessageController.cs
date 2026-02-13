using System.Security.Claims;
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
    [Route("{conversationId}")]
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
}

