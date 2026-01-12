using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;
using Messenger.Domain.Entities;

namespace Messenger.Application.Services;

public class UserService(IUserRepository usersRepository, AuthenticationService authenticationService)
{
    public async Task<User> CreateUser(CreateUserDto userDto)
    {
        User user = new User()
        {
            PhoneNumber = userDto.PhoneNumber,
            Username = $"user_{userDto.PhoneNumber.Replace("+", "").Replace("-", "").Replace(" ", "")}",
            RefreshTokens = new List<RefreshToken>()
        };
        
        return await usersRepository.CreateUserAsync(user);
    }
    
    public async Task<User?> GetUserByPhoneNumber(string phoneNumber)
    {
        return await usersRepository.GetUserByPhoneNumberAsync(phoneNumber);
    }
    
    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        return await usersRepository.GetUserByIdAsync(userId);
    }

    public async Task<User?> UpdateUserName(Guid userid, string name)
    {
        var user = await usersRepository.GetUserByIdAsync(userid);
        if (user == null)
            throw new Exception("User not found");
        user.Name = name;
        user = await usersRepository.UpdateUser(user);
        return user;
    }

    public async Task<User?> UpdateUserStatus(Guid userid, string status)
    {
        var user = await usersRepository.GetUserByIdAsync(userid);
        if (user == null)
            throw new Exception("User not found");
        user.Status = status;
        user = await usersRepository.UpdateUser(user);
        return user;
    }

    public async Task<User> UpdateUserAvatar(Guid userid, string avatarurl)
    {
        var user = await usersRepository.GetUserByIdAsync(userid);
        if (user != null)
        {
            user.AvatarUrl = avatarurl;
            user = await usersRepository.UpdateUser(user);
            return user;
        }
        throw new Exception("User not found");
    }

    public async Task LogoutUser(Guid userid)
    {
        await usersRepository.LogoutUser(userid);
    }

    public async Task<List<User>> SearchUsersByNameSubstring(string query)
    {
        var allUsers = await usersRepository.GetAllUsersAsync();
        
        if (string.IsNullOrWhiteSpace(query))
            return new List<User>();
        
        var lowerQuery = query.ToLower();
        return allUsers
            .Where(u => (u.Username != null && u.Username.ToLower().Contains(lowerQuery)) ||
                        (u.Name != null && u.Name.ToLower().Contains(lowerQuery)))
            .ToList();
    }
}