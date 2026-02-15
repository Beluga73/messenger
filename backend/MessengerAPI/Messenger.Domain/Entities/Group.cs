using System.ComponentModel.DataAnnotations;

namespace Messenger.Domain.Entities;

public class Group : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }
    
    public string? Description { get; set; }
    
    public string AvatarUrl { get; set; } = "https://messengerstorage.blob.core.windows.net/userpfps/default.jpg";
    
    [Required]
    public Guid CreatorId { get; set; }
    
    [Required]
    public User Creator { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Required]
    public List<GroupMember> Members { get; set; } = new();
    
    [Required]
    public List<GroupMessage> Messages { get; set; } = new();
    
    public DateTime LastMessageAt { get; set; } = DateTime.UtcNow;
}
