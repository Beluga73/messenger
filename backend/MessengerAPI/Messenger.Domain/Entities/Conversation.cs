using System.ComponentModel.DataAnnotations;

namespace Messenger.Domain.Entities;

public class Conversation : BaseEntity
{
    [Required]
    public User User1 { get; set; }
    
    [Required]
    public Guid User1Id { get; set; }
    
    [Required]
    public User User2 { get; set; }
    
    [Required]
    public Guid User2Id { get; set; }
    
    [Required]
    public List<Message> Messages { get; set; } = new();
    
    public DateTime LastMessageAt { get; set; } = DateTime.UtcNow;
}

