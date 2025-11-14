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
    
    [HttpPost]
    [Route("register/verify")]
    public async Task<IActionResult> RegisterVerify([FromForm] CreateUserDto userDto)
    {
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