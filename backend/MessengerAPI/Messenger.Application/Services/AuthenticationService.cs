using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;
using Messenger.Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Messenger.Application.Services;

public class AuthenticationService(IOptions<AuthSettings> authSettings, IRefreshTokenRepository refreshTokenRepository)
{
    public string GenerateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim("session_secret_version", user.SessionSecretVersion.ToString())
        };

        var token = new JwtSecurityToken(
            expires: DateTime.UtcNow.Add(authSettings.Value.TokenExpiration),
            claims: claims,
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authSettings.Value.SecretKey)),
                SecurityAlgorithms.HmacSha256Signature)
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<string> GenerateRefreshToken(string  userPhoneNumber)
    {
        var token =  await refreshTokenRepository.CreateToken(userPhoneNumber);
        return token.Token;
    }
    
    public async Task<TokenDto> RefreshToken(string token)
    {
        var reftoken =  await refreshTokenRepository.RefRefreshToken(token);
        var jwt_token = GenerateJwtToken(reftoken.User);
        return new TokenDto(jwt_token, reftoken.Token);
    }
}