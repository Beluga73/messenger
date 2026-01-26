using System.Security.Claims;
using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;
using Messenger.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MessengerWeb.Controllers;

[Authorize]
[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    private readonly UserService _userService;
    
    public SearchController(UserService userSer)
    {
        _userService = userSer;
    }

    [HttpGet("username")]
    public async Task<IActionResult> SearchByName([FromQuery] string query)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                    ?? throw new Exception("User not authenticated"));
            
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Search query is required");

            var users = await _userService.SearchUsersByNameSubstring(query, userId);

            if (users == null || users.Count == 0)
                return NotFound("No users found");

            var userDtos = users.Select(u => new UserDto(u)
            ).ToList();

            return Ok(userDtos);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}