using System.ComponentModel.DataAnnotations;

namespace Messenger.Domain.Entities;

public class GroupMessage : BaseEntity
{
    [Required]
    public Guid GroupId { get; set; }
    
    [Required]
    public Group Group { get; set; }
    
    [Required]
    public Guid SenderId { get; set; }
    
    [Required]
    public User Sender { get; set; }
    
    [Required]
    public string Content { get; set; }
    
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}
