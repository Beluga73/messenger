using Messenger.Application.Interfaces;
using Messenger.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Messenger.Infrastructure.Data.Repositories;

public class UserRepository(MessengerDbContext _context) : IUserRepository
{
    public async Task<User?> GetUserByIdAsync(Guid id)
    {
        return await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Id == id);
        
    }
    
    public async Task<User> CreateUserAsync(User user)
    {
        var userEntry = await _context.Set<User>().AddAsync(user);
        var userEntryEntity = userEntry.Entity;
        await _context.SaveChangesAsync();
        return userEntryEntity;
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Username == username);
    }
    
    public async Task<User?> GetUserByPhoneNumberAsync(string phoneNumber)
    {
        return await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
    }

    public async Task<User> UpdateUser(User user)
    {
        _context.Set<User>().Update(user);
        await _context.SaveChangesAsync();
        return user;
    }
    
    public async Task LogoutUser(Guid userId)
    {
        var user = await _context.Set<User>()
            .Include(x => x.RefreshTokens)
            .FirstOrDefaultAsync(u => u.Id == userId);  
        
        foreach (var token in user.RefreshTokens.Where(t => t.Revoked == null && !t.IsExpired))
        {
            token.Revoked = DateTime.UtcNow;
        }
        
        user.SessionSecretVersion++;
        
        await _context.SaveChangesAsync();
    }
    
}