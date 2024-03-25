using ChatApplication.Data;
using ChatApplication.Dtos;
using ChatApplication.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using ChatApplication.Respone;

namespace ChatApplication.Repositories;

public class FrameworkChatRoomRepository : IChatRoomRepository
{
    private readonly ChatApplicationContext dbContext;
    private readonly ILogger<FrameworkChatRoomRepository> _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly UserManager<User> _userManager;

    public FrameworkChatRoomRepository(ChatApplicationContext dbContext, ILogger<FrameworkChatRoomRepository> logger, IHttpContextAccessor httpContextAccessor,
                                      UserManager<User> userManager)
    {
        this.dbContext = dbContext;
        _logger = logger;
        _httpContextAccessor = httpContextAccessor;
        _userManager = userManager;
    }

    public async Task<ChatRoomDto> AddAsync(ChatRoom chatRoom)
    {
        dbContext.ChatRooms.Add(chatRoom);
        await dbContext.SaveChangesAsync(); 

        var user = await _userManager.FindByNameAsync(_httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name));
        var newUserChatRoom = new UserChatRoom
        {
            UserId = user.Id,
            ChatRoomId = chatRoom.Id,
        };
        dbContext.userChatRooms.Add(newUserChatRoom);
        await dbContext.SaveChangesAsync();
        return new ChatRoomDto 
        {
            Id= chatRoom.Id,
            Name = chatRoom.Name,
            Description = chatRoom.Description,
            IsPrivate = chatRoom.IsPrivate,
            ImageUrl = chatRoom.ImageUrl
        };
    }

    public async Task<DeleteChatRoomRespone> DeleteAsync(long chatRoomId)
    {
        var chatroomToDelete = dbContext.ChatRooms.Find(chatRoomId);
        var user = await _userManager.FindByNameAsync(_httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name));
        if(chatroomToDelete.OwnerId !=  user.Id)
        {
            return new DeleteChatRoomRespone
            {
                StatusCode = StatusCodes.Status401Unauthorized,
                ErrorMessage = "Can not delete Chat Room becasue User is not owner"
            };
        }

        if (chatroomToDelete != null)
        {
            try
            {
                dbContext.ChatRooms.Remove(chatroomToDelete);
                await dbContext.SaveChangesAsync();
                return new DeleteChatRoomRespone
                {
                    StatusCode = StatusCodes.Status204NoContent
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting chat room: {ex.Message}", ex);
            }
        }
        else
        {
            return new DeleteChatRoomRespone
            {
                StatusCode = StatusCodes.Status404NotFound,
                ErrorMessage = $"ChatRoom With ID {chatRoomId} Not Found"
            };
        }
    }

    public async Task<ChatRoomDto> GetByIdAsync(long chatRoomId)
    {
        var chatroom = await dbContext.ChatRooms.FindAsync(chatRoomId);
        if (chatroom == null)
        {
            return null;
        }
        else
        {
            ChatRoomDto chatroomdto = new ChatRoomDto
            {
                Id = chatroom.Id,
                Name = chatroom.Name,
                Description = chatroom.Description,
                IsPrivate = chatroom.IsPrivate,
            };
            return chatroomdto;
        }
    }
    public async Task<List<ChatRoomDto>> GetAllAsync()
    {
        var chatRooms = await dbContext.ChatRooms.ToListAsync();  //ToListAsync get error with using System.Data.Entity have to use using Microsoft.EntityFrameworkCore;
        return chatRooms.Select(c => c.AsDto())
                        .ToList();
    }
    public async Task UpdateAsync(string chatRoomId, UpdateChatRoomDto updateChatRoomDto)
    {
        var existingChatRoom = await dbContext.ChatRooms.FindAsync(chatRoomId);
        if (existingChatRoom == null)
        {
            throw new InvalidOperationException($"chat room with ID ${chatRoomId} not found");
        }
        else
        {
            existingChatRoom.Name = updateChatRoomDto.Name;
            existingChatRoom.Description = updateChatRoomDto.Description;
            existingChatRoom.IsPrivate = updateChatRoomDto.IsPrivate;
            await dbContext.SaveChangesAsync();
        }
    }
}
