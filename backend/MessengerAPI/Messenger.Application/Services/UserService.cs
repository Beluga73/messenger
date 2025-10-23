using Messenger.Application.Dtos;
using Messenger.Application.Interfaces;
using Messenger.Domain.Entities;

namespace Messenger.Application.Services;

public class UserService(IUserRepository usersRepository, HashingService hashingService, AuthenticationService authenticationService)
{
    public async Task<User> CreateUser(CreateUserDto userDto)
    {
        User user = new User()
        {
            Username = userDto.Username,
            PhoneNumber = userDto.PhoneNumber,
            
        };
        
        if (await usersRepository.GetUserByUsernameAsync(user.Username) != null)
        {
            throw new Exception("Username already exists");
        }
        
        var passwordhash = hashingService.HashPassword(userDto.Password);
        user.PasswordHash = passwordhash;

        return await usersRepository.CreateUserAsync(user);
    }
    
    public async Task<User?> GetUserByPhoneNumber(string phoneNumber)
    {
        return await usersRepository.GetUserByPhoneNumberAsync(phoneNumber);
    }

    public async Task<User?> UpdateUserName(Guid userid, string name)
    {
        var user = await usersRepository.GetUserByIdAsync(userid);
        user.Name = name;
        user = await usersRepository.UpdateUser(user);
        return user;
    }

    public async Task<User?> UpdateUserStatus(Guid userid, string status)
    {
        var user = await usersRepository.GetUserByIdAsync(userid);
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
}