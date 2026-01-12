using Messenger.Domain.Entities;

namespace Messenger.Application.Dtos;

public class UserDto
{
    public  Guid Id { get; set; }
    
    public string Username { get; set; }
    public string Name { get; set; }
    public string PhoneNumber { get; set; }
    public string AvatarUrl { get; set; }
    public string Status { get; set; }


    public UserDto(User user)
    {
        Id = user.Id;
        Name = user.Name;
        Username = user.Username;
        PhoneNumber = user.PhoneNumber;
        Status = user.Status;
        AvatarUrl = user.AvatarUrl;
    }
}