using System.Security.Claims;
using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MessengerWeb.Controllers;

[Authorize]
[ApiController]
[Route("api/secret-chats")]
public class SecretChatController(ISecretChatService secretChatService) : ControllerBase
{
    /// <summary>
    /// Get all secret chats for the current user
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetSecretChats()
    {
        try
        {
            var userId = GetUserId();
            var chats = await secretChatService.GetUserSecretChatsAsync(userId);
            return Ok(chats);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Initiate a new E2E encrypted secret chat
    /// </summary>
    [HttpPost("initiate")]
    public async Task<IActionResult> InitiateSecretChat([FromBody] InitiateSecretChatDto dto)
    {
        try
        {
            var userId = GetUserId();
            var chat = await secretChatService.InitiateSecretChatAsync(userId, dto);
            return Ok(chat);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Accept a secret chat invitation and complete key exchange
    /// </summary>
    [HttpPost("{secretChatId}/accept")]
    public async Task<IActionResult> AcceptSecretChat(Guid secretChatId, [FromBody] AcceptSecretChatDto dto)
    {
        try
        {
            var userId = GetUserId();
            var chat = await secretChatService.AcceptSecretChatAsync(userId, secretChatId, dto);
            return Ok(chat);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Close/decline a secret chat (clears keys for forward secrecy)
    /// </summary>
    [HttpPost("{secretChatId}/close")]
    public async Task<IActionResult> CloseSecretChat(Guid secretChatId)
    {
        try
        {
            var userId = GetUserId();
            await secretChatService.CloseSecretChatAsync(userId, secretChatId);
            return Ok(new { message = "Secret chat closed" });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Get a specific secret chat by ID
    /// </summary>
    [HttpGet("{secretChatId}")]
    public async Task<IActionResult> GetSecretChat(Guid secretChatId)
    {
        try
        {
            var userId = GetUserId();
            var chat = await secretChatService.GetSecretChatAsync(userId, secretChatId);
            return Ok(chat);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Get encrypted messages for a secret chat (paginated)
    /// </summary>
    [HttpGet("{secretChatId}/messages")]
    public async Task<IActionResult> GetSecretMessages(Guid secretChatId, [FromQuery] int skip = 0, [FromQuery] int take = 50)
    {
        try
        {
            var userId = GetUserId();
            var messages = await secretChatService.GetSecretMessagesAsync(userId, secretChatId, skip, take);
            return Ok(messages);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    private Guid GetUserId()
    {
        return Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                          ?? throw new Exception("User not authenticated"));
    }
}
