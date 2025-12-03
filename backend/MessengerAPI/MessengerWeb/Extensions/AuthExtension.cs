using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Messenger.Application;
using Messenger.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace MessengerWeb.Extensions;

public static class AuthExtension
{
    public static IServiceCollection AddAuth(this IServiceCollection serviceCollection, IConfiguration configuration)
    {
        var settings = configuration.GetSection("AuthSettings").Get<AuthSettings>();
        
        if (settings == null || string.IsNullOrEmpty(settings.SecretKey))
        {
            throw new InvalidOperationException("AuthSettings:SecretKey not configured in app settings");
        }

        serviceCollection.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.SecretKey))
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) &&
                            path.StartsWithSegments(""))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    },
                    
                    OnTokenValidated = async context =>
                    {
                        var db = context.HttpContext.RequestServices.GetRequiredService<MessengerDbContext>();
                        var userIdString = context.Principal.FindFirstValue(ClaimTypes.NameIdentifier)
                                         ?? context.Principal.FindFirstValue(JwtRegisteredClaimNames.Sub);

                        if (Guid.TryParse(userIdString, out Guid userId))
                        {
                            var user = await db.Users.FindAsync(userId);
                            var tokenVersionClaim = context.Principal.FindFirst("session_secret_version")?.Value;
                            
                            if (user == null || tokenVersionClaim == null)
                            {
                                context.Fail("Token invalid or outdated");
                                return;
                            }
                            
                            if (int.TryParse(tokenVersionClaim, out int tokenVersion))
                            {
                                if (user.SessionSecretVersion != tokenVersion)
                                {
                                    context.Fail("Token invalid or outdated");
                                }
                            }
                        }
                    }
                };
            });

        return serviceCollection;
    }
}