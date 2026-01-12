using Messenger.Application.Dtos;
using Messenger.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MessengerWeb.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class SearchController : ControllerBase
{
    private readonly UserService _userService;
    
    public SearchController(UserService userSer)
    {
        _userService = userSer;
    }
    
    [HttpGet("by-name")]
    public async Task<IActionResult> SearchByName([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest("Search query is required");
        
        var users = await _userService.SearchUsersByNameSubstring(query);
        
        if (users == null || users.Count == 0)
            return NotFound("No users found");
        
        var userDtos = users.Select(u => new UserDto(u)
).ToList();
        
        return Ok(userDtos);
    }
}