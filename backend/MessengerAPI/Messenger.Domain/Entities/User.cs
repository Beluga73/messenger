using System.ComponentModel.DataAnnotations;

namespace Messenger.Domain.Entities;

public class User : BaseEntity
{
    public string AvatarUrl { get; set; } = "https://messengerstorage.blob.core.windows.net/userpfps/default.jpg";
    public string? Name { get; set; } 
    
    public string? Status { get; set; }
    
    public string Username { get; set; }
    
    [Required]
    public string PhoneNumber { get; set; }
    
    [Required]
    public List<RefreshToken> RefreshTokens { get; set; }

    [Required]
    public int SessionSecretVersion { get; set; } = 1;
}