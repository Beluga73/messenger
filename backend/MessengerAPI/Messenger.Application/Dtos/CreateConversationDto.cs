namespace Messenger.Application.Dtos
{
    public class CreateConversationDto
    {
        public string Name { get; set; } = string.Empty;
        public List<Guid> ParticipantIds { get; set; } = new();
        public bool IsGroup { get; set; }
    }
}