using System.ComponentModel.DataAnnotations;

namespace Messenger.Application.Dtos;

public class CreateGroupDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }
    
    public string? Description { get; set; }
    
    [Required]
    [MinLength(1)]
    public List<Guid> MemberIds { get; set; } = new();
}
