using Messenger.Domain.Entities;

namespace Messenger.Application.Dtos;

public class UserDto
{
    public  Guid userid { get; set; }
    
    public  string? Name { get; set; }
    
    public  string Username { get; set; }
    
    public  string PhoneNumber { get; set; }
    
    public  string? Status { get; set; }

    public UserDto(User user)
    {
        userid = user.Id;
        Name = user.Name;
        Username = user.Username;
        PhoneNumber = user.PhoneNumber;
        Status = user.Status;
    }
}