using Messenger.Application.Interfaces;
using Messenger.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Messenger.Infrastructure.Data.Repositories;

public class RefreshTokenRepository(MessengerDbContext _context): IRefreshTokenRepository
{
    public async Task<RefreshToken> CreateToken(string phoneNumber)
    {
        var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
        if (user == null)
        {
            throw new Exception("User not found");       
        }
        var token = new RefreshToken
        {
            User = user
        };
        
        _context.Add(token);
        await _context.SaveChangesAsync();
        return token;
    }

    public async Task<RefreshToken> RefRefreshToken(string token)
    {
        var rtoken = await _context.Set<RefreshToken>()
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Token == token);

        if (rtoken == null)
        {
            throw new Exception("Invalid token");
        }

        if (!rtoken.IsActive)
        {
            throw new Exception("Token is not active");       
        }
        
        rtoken.Revoked = DateTime.UtcNow;
        
        var newToken = await CreateToken(rtoken.User.PhoneNumber);
        _context.Set<RefreshToken>().Update(rtoken);
        await _context.SaveChangesAsync();
        return newToken;
    }
}