using System.Security.Claims;
using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MessengerWeb.Controllers;

[Authorize]
[ApiController]
[Route("api/groups")]
public class GroupController(IGroupService groupService) : ControllerBase
{
    private Guid GetUserId()
    {
        return Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? throw new Exception("User not authenticated"));
    }

    /// <summary>
    /// Get all groups for the current user
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetGroups()
    {
        try
        {
            var userId = GetUserId();
            var groups = await groupService.GetUserGroupsAsync(userId);
            return Ok(groups);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Get a specific group by ID
    /// </summary>
    [HttpGet("{groupId}")]
    public async Task<IActionResult> GetGroup(Guid groupId)
    {
        try
        {
            var userId = GetUserId();
            var group = await groupService.GetGroupAsync(groupId, userId);
            return Ok(group);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Update group details (admin only)
    /// </summary>
    [HttpPut("{groupId}")]
    public async Task<IActionResult> UpdateGroup(Guid groupId, [FromBody] UpdateGroupDto dto)
    {
        try
        {
            var userId = GetUserId();
            var group = await groupService.UpdateGroupAsync(groupId, userId, dto);
            return Ok(group);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Delete a group (creator only)
    /// </summary>
    [HttpDelete("{groupId}")]
    public async Task<IActionResult> DeleteGroup(Guid groupId)
    {
        try
        {
            var userId = GetUserId();
            await groupService.DeleteGroupAsync(groupId, userId);
            return NoContent();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Add members to a group (admin only)
    /// </summary>
    [HttpPost("{groupId}/members")]
    public async Task<IActionResult> AddMembers(Guid groupId, [FromBody] AddGroupMembersDto dto)
    {
        try
        {
            var userId = GetUserId();
            var group = await groupService.AddMembersAsync(groupId, userId, dto);
            return Ok(group);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Remove a member from a group (admin only)
    /// </summary>
    [HttpDelete("{groupId}/members/{memberUserId}")]
    public async Task<IActionResult> RemoveMember(Guid groupId, Guid memberUserId)
    {
        try
        {
            var userId = GetUserId();
            await groupService.RemoveMemberAsync(groupId, userId, memberUserId);
            return NoContent();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Leave a group
    /// </summary>
    [HttpPost("{groupId}/leave")]
    public async Task<IActionResult> LeaveGroup(Guid groupId)
    {
        try
        {
            var userId = GetUserId();
            await groupService.LeaveGroupAsync(groupId, userId);
            return NoContent();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}
