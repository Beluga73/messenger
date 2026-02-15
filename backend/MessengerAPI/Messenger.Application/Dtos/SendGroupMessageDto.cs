using System.ComponentModel.DataAnnotations;

namespace Messenger.Application.Dtos;

public class SendGroupMessageDto
{
    [Required]
    public Guid GroupId { get; set; }
    
    [Required]
    public string Content { get; set; }
}
