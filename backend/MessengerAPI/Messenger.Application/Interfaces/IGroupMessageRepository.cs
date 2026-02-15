using Messenger.Domain.Entities;

namespace Messenger.Application.Interfaces;

public interface IGroupMessageRepository
{
    Task<GroupMessage> CreateMessageAsync(GroupMessage message);
    Task<List<GroupMessage>> GetMessagesByGroupIdAsync(Guid groupId, int skip = 0, int take = 50);
    Task<GroupMessage?> GetMessageByIdAsync(Guid messageId);
}
