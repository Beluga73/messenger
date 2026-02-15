namespace Messenger.Application.Dtos;

public class AddGroupMembersDto
{
    public List<Guid> MemberIds { get; set; } = new();
}
