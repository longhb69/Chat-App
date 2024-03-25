using ChatApplication.Dtos;
using ChatApplication.Models;
using ChatApplication.Respone;

namespace ChatApplication.Repositories;

public interface IChatRoomRepository
{
    Task<ChatRoomDto> AddAsync(ChatRoom chatRoom);
    Task<ChatRoomDto> GetByIdAsync(long chatRoomId);
    Task <List<ChatRoomDto>> GetAllAsync();
    Task UpdateAsync(string chatRoomId, UpdateChatRoomDto updateChatRoomDto);
    Task<DeleteChatRoomRespone> DeleteAsync(long chatRoomId);

}
