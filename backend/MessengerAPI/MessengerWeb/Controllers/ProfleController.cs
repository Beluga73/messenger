using System.Security.Claims;
using Messenger.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;

namespace MessengerWeb.Controllers;

[Authorize]
[ApiController]
[Route("api/profile")]
public class ProfleController(UserService userService, IBlobService blobService) : ControllerBase
{
    [HttpPut]
    [Route("update/text")]
    public async Task<IActionResult> UpdateProfile([FromBody] string newStatus,string newName)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            await userService.UpdateUserName(userId, newName);
            var user = await userService.UpdateUserStatus(userId, newStatus);
            return Ok(new UserDto(user));
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);       
        }
    }
    
    [HttpPost]
    [Route("upload/picture")]
    public async Task<IActionResult> UploadPicture(IFormFile file)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var avatarurl = await blobService.UploadBlobAsync(userId.ToString(), file.OpenReadStream());
        var user = await userService.UpdateUserAvatar(userId, avatarurl.ToString());
        return Ok(new UserDto(user));
    }
}