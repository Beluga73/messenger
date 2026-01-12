using Messenger.Domain.Entities;

namespace Messenger.Application.Interfaces;

public interface IUserRepository
{
    public Task<User?> GetUserByIdAsync(Guid id);
    public Task<User> CreateUserAsync(User user);
    
    public Task<User?> GetUserByUsernameAsync(string username);
    
    public Task<User?> GetUserByPhoneNumberAsync(string phoneNumber);
    
    public Task<User> UpdateUser(User user);

    public Task LogoutUser(Guid userId);
    
    public Task<List<User>> GetAllUsersAsync();
}