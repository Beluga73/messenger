using System.Security.Claims;
using Messenger.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;
using Messenger.Domain.Entities;

namespace MessengerWeb.Controllers;

[Authorize]
[ApiController]
[Route("api/profile")]
public class ProfileController(UserService userService, IBlobService blobService) : ControllerBase
{
    /// <summary>
    /// Updates user profile name and status
    /// </summary>
    /// <param name="dto">Profile update data</param>
    /// <returns>Updated user profile</returns>
    [HttpPut]
    [Route("update/text")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                    ?? throw new Exception("User not authenticated"));
            
            if (!string.IsNullOrEmpty(dto.NewName))
            {
                await userService.UpdateUserName(userId, dto.NewName);
            }
            
            User? user = null;
            if (!string.IsNullOrEmpty(dto.NewStatus))
            {
                user = await userService.UpdateUserStatus(userId, dto.NewStatus);
            }
            
            if (user == null)
            {
                user = await userService.GetUserByIdAsync(userId) 
                       ?? throw new Exception("User not found");
            }
            
            return Ok(new UserDto(user));
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);       
        }
    }
    
    /// <summary>
    /// Uploads a profile picture
    /// </summary>
    /// <param name="file">Image file to upload</param>
    /// <returns>Updated user profile</returns>
    
    [HttpPost]
    [Route("upload/picture")]
    public async Task<IActionResult> UploadPicture(IFormFile file)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                    ?? throw new Exception("User not authenticated"));
            var avatarurl = await blobService.UploadBlobAsync(userId.ToString(), file.OpenReadStream());
            var user = await userService.UpdateUserAvatar(userId, avatarurl.ToString());
            return Ok(new UserDto(user));
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}

