using System.ComponentModel.DataAnnotations;

namespace Messenger.Domain.Entities;

public class RefreshToken : BaseEntity
{
    [Required]   
    public string Token { get; set; } = Guid.NewGuid().ToString();
    [Required]
    public User User { get; set; }
    [Required]   
    public DateTime Expires { get; set; } = DateTime.UtcNow + TimeSpan.FromDays(30);
    [Required]
    public bool IsExpired => DateTime.UtcNow >= Expires;
    [Required]
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime? Revoked { get; set; } = null;
    
    [Required] 
    public bool IsActive => Revoked == null && !IsExpired;
}
