using System.ComponentModel.DataAnnotations;

namespace Messenger.Domain.Entities;

public enum GroupRole
{
    Member = 0,
    Admin = 1
}

public class GroupMember : BaseEntity
{
    [Required]
    public Guid GroupId { get; set; }
    
    [Required]
    public Group Group { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    public User User { get; set; }
    
    public GroupRole Role { get; set; } = GroupRole.Member;
    
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}
