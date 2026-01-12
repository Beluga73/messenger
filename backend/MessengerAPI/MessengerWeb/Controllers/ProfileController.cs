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
    /// Generates a temporary Shared Access Signature (SAS) URI for direct-to-Azure upload.
    /// </summary>
    /// <remarks>
    /// The frontend should use the returned `UploadUrl` to perform a PUT request.
    /// 
    /// **Example Upload Request:**
    /// PUT [UploadUrl]
    /// x-ms-blob-type: BlockBlob
    /// Content-Type: image/jpeg
    /// [Binary Data]
    /// </remarks>
    /// <returns>An object containing the signed UploadUrl and the FinalAvatarUrl for storage.</returns>
    /// <response code="200">Successfully generated SAS token</response>
    /// <response code="401">User is not authenticated</response>
    [HttpGet]
    [Route("upload/sas-url")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public IActionResult GetUploadSasUrl()
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                    ?? throw new Exception("User not authenticated"));
            
            string blobName = $"{userId}.jpg"; 
        
            // Get the secure SAS URL
            var sasUrl = blobService.GenerateUploadSasUri(blobName);
        
            // Return both the SAS URL for uploading and the final URL for the DB
            return Ok(new { 
                UploadUrl = sasUrl,
                FinalAvatarUrl = sasUrl.Split('?')[0] // The URL without the token
            });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Confirms a successful upload and updates the user's avatar URL in the database.
    /// </summary>
    /// <param name="avatarUrl">The permanent URL of the uploaded image (without SAS tokens).</param>
    /// <remarks>
    /// This should be called only AFTER the frontend receives a 201 Created from Azure Storage.
    /// </remarks>
    /// <returns>The updated User profile data.</returns>
    /// <response code="200">User profile updated successfully</response>
    /// <response code="400">Invalid URL provided or user not found</response>
    [HttpPost]
    [Route("upload/confirm")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> ConfirmUpload([FromBody] string avatarUrl)
    {
        // After frontend uploads to Azure, it calls this to update the DB
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                ?? throw new Exception("User not authenticated"));
    
        var user = await userService.UpdateUserAvatar(userId, avatarUrl);
        return Ok(new UserDto(user));
    }
    
    /// <summary>
    /// Updates the user's username.
    /// </summary>
    /// <param name="request">The new username to set.</param>
    /// <returns>The updated User profile data.</returns>
    /// <response code="200">Username updated successfully</response>
    /// <response code="400">Invalid request or user not found</response>
    /// <response code="401">User is not authenticated</response>
    /// <response code="409">Username already exists</response>
    [HttpPut]
    [Route("username")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> UpdateUsername([FromBody] string username)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                ?? throw new Exception("User not authenticated"));

        if (string.IsNullOrWhiteSpace(username))
        {
            return BadRequest("Username cannot be empty");
        }

        var user = await userService.UpdateUserName(userId, username);
        return Ok(new UserDto(user));
    }
    catch (InvalidOperationException ex) when (ex.Message.Contains("already exists"))
    {
        return Conflict("Username already exists");
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}

/// <summary>
/// Updates the user's display name.
/// </summary>
/// <param name="request">The new name to set.</param>
/// <returns>The updated User profile data.</returns>
/// <response code="200">Name updated successfully</response>
/// <response code="400">Invalid request or user not found</response>
/// <response code="401">User is not authenticated</response>
[HttpPut]
[Route("name")]
[ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
public async Task<IActionResult> UpdateName([FromBody] string Name)
{
    try
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                ?? throw new Exception("User not authenticated"));

        if (string.IsNullOrWhiteSpace(Name))
        {
            return BadRequest("Name cannot be empty");
        }

        var user = await userService.UpdateUserName(userId, Name);
        if (user == null)
        {
            return BadRequest("User not found");
        }

        return Ok(new UserDto(user));
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}
}