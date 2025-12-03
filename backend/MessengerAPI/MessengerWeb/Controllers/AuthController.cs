using System.Security.Claims;
using Messenger.Application.Dtos;
using Messenger.Application.Services;
using Messenger.Infrastructure.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MessengerWeb.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(PhoneVerificationService verification, UserService userService, AuthenticationService authservice) : ControllerBase
{
    /// <summary>
    /// Initiates phone number verification by sending an SMS code
    /// </summary>
    /// <param name="phoneNumber">Phone number in E.164 format (e.g., +1234567890)</param>
    /// <returns>Verification status</returns>
    [HttpPost]
    [Route("register/initiate")]
    public IActionResult RegisterInitiate([FromForm] string phoneNumber)
    {
        try
        {
            var result = verification.SendVerificationCode(phoneNumber);
            return Ok(new { result });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    /// <summary>
    /// Verifies the SMS code and creates/authenticates the user
    /// </summary>
    /// <param name="code">Verification code received via SMS</param>
    /// <param name="phoneNumber">Phone number used for verification</param>
    /// <returns>JWT token and refresh token</returns>
    [HttpPost]
    [Route("register/verify")]
    public async Task<IActionResult> RegisterVerify([FromForm] string code,[FromForm] string phoneNumber)
    {
        var userDto = new CreateUserDto(phoneNumber, code);
        try
        {
            var result =  verification.VerifyCode(userDto.PhoneNumber, userDto.Code);
            
            if (result == "approved")
            {
                var user = await userService.GetUserByPhoneNumber(userDto.PhoneNumber);
                if (user == null)
                {
                    await userService.CreateUser(userDto);
                    user = await userService.GetUserByPhoneNumber(userDto.PhoneNumber);
                }
                var jwttoken = authservice.GenerateJwtToken(user);
                var reftoken = await authservice.GenerateRefreshToken(user.PhoneNumber);
                return Ok(new TokenDto(jwttoken, reftoken));
            }
            return BadRequest("Verification failed");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Refreshes the JWT token using a refresh token
    /// </summary>
    /// <param name="token">Refresh token</param>
    /// <returns>New JWT token and refresh token</returns>
    [HttpPost]
    [Route("token/refresh")]
    public async Task<IActionResult> RefreshToken([FromForm] string token)
    {
        try
        {
            var tokenresult = await authservice.RefreshToken(token);
            return Ok(tokenresult);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);       
        }
    }
    
    /// <summary>
    /// Logs out the user from all devices, invalidating all refresh tokens
    /// </summary>
    /// <returns>Success status</returns>
    [HttpPost]
    [Authorize]
    [Route("logout/all")]
    public async Task<IActionResult> LogoutAll()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        try
        {
            await userService.LogoutUser(userId);
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);      
        }
    }
}