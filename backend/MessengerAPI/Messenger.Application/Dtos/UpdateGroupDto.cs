using System.ComponentModel.DataAnnotations;

namespace Messenger.Application.Dtos;

public class UpdateGroupDto
{
    [MaxLength(100)]
    public string? Name { get; set; }
    
    public string? Description { get; set; }
}
