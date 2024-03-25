using ChatApplication.Dtos;
using ChatApplication.Models;
using ChatApplication.Respone;

namespace ChatApplication.Repositories;

public interface IMessageRepository
{
    Task<long> Add(Message message);
    Task<AttachmentRespone> AddAttachmentAysnc(long messageId, string fileExtension, string objectUrl, string objName, int width, int height);
    Task<Message> GetById(long messageId);
    Task<MessageResult> GetMessagesForChatRoom(long chatRoomId, int pageNumber, int pageSize);
    Task <List<Message>> GetMessageBetweenUsers(string senderId, string receiverId); 
    Task Delete(long messageId);
}
