using ChatApplication.Data;
using ChatApplication.Dtos;
using ChatApplication.Models;
using ChatApplication.Respone;
using ChatApplication.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Owin.Security.Provider;

//using System.Data.Entity;
using System.Linq;
using System.Security.Claims;


namespace ChatApplication.Repositories;

public class EntityFrameworkMessageRepository : IMessageRepository
{
    private readonly ChatApplicationContext dbContext;
    private readonly UserManager<User> _userManager;
    private readonly ILogger<EntityFrameworkMessageRepository> _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IConfiguration _config;

    public EntityFrameworkMessageRepository(ChatApplicationContext dbContext, UserManager<User> userManager, ILogger<EntityFrameworkMessageRepository> logger,
                                            IHttpContextAccessor httpContextAccessor, IConfiguration config)
    {
        this.dbContext = dbContext;
        this._logger = logger;
        this._userManager = userManager;
        this._httpContextAccessor = httpContextAccessor;
        this._config = config;
    }

    public async Task<long> Add(Message message)
    {
        dbContext.Messages.Add(message);
        await dbContext.SaveChangesAsync();
        return message.Id;
        //return Task.CompletedTask;
    }

    public async Task<AttachmentRespone> AddAttachmentAysnc(long messageId, string fileExtension, string objectUrl, string objName, int width, int height)
    {
        var response = new AttachmentRespone();
        var message = await dbContext.Messages.FindAsync(messageId);
        if(message != null)
        {
            try
            {
                if (message.Attachments == null)
                {
                    message.Attachments = new List<Attachment>();
                }
                var attachment = new Attachment
                {
                    Name = objName,
                    MessageId = messageId,
                    FileType = fileExtension,
                    Width = width,
                    Height = height,
                    Url = objectUrl,
                };
                message.Attachments.Add(attachment);
                await dbContext.SaveChangesAsync();
                response.StatusCode = StatusCodes.Status200OK;
                response.Message = $"{attachment.Id} has been created successfully";
                response.Attachemnt = attachment.AsDto();
            }
            catch (Exception ex)
            {
                response.StatusCode = StatusCodes.Status500InternalServerError;
                response.Message = ex.Message;
            }
        }else
        {
            _logger.LogInformation(messageId.ToString());
            _logger.LogInformation("Message not found");
        }
        
        return response;
    }


    public async Task Delete(long messageId)
    {
        var messageToDelete = await dbContext.Messages.FindAsync(messageId);
        if(messageToDelete != null)
        {
            dbContext.Messages.Remove(messageToDelete);
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task<List<Message>> GetMessageBetweenUsers(string senderId, string receiverId)
    {
        return await dbContext.Messages
            .Where(m => (m.SenderId == senderId && m.ReceiverId == receiverId) ||
                        (m.SenderId == receiverId && m.ReceiverId == senderId))
            .OrderBy(m => m.Timestamp)
            .ToListAsync();
    }

    public async Task<MessageResult> GetByIdAysnc(long messageId)
    {
        var message = await dbContext.Messages.FindAsync(messageId);
        if(message == null) 
        {
            return new MessageResult
            {
                StatusCode = StatusCodes.Status404NotFound,
                ErrorMessage = $"Message with ID ${messageId} Not Found!"
            };
        }
        else
        {
            User user = await dbContext.Users.FindAsync(message.SenderId);
            List<Attachment> attachment = await dbContext.Attachments.Where(a => a.MessageId == message.Id).ToListAsync();
            List<Emoji> emojis = await dbContext.Emojis.Where(e => e.MessageId == message.Id).ToListAsync();
            MessageDto test = message.AsDto(user, attachment, emojis);
            return new MessageResult
            {
                StatusCode = StatusCodes.Status200OK,
                MessageDto = message.AsDto(user, attachment, emojis)
            };
        }
    }

    public async Task<MessageResult> GetMessagesForChatRoom(long chatRoomId ,int pageNumber, int pageSize)
    {
        var user = await _userManager.FindByNameAsync(_httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name));
       // var user = await _userManager.FindByNameAsync("long");
        string userId = string.Empty;
        if(user != null)
        {
            userId = user.Id;
        }
        var userInRoom = await dbContext.userChatRooms
            .AnyAsync(uc => uc.UserId == userId && uc.ChatRoomId == chatRoomId);
        if(!userInRoom)
        {
            return new MessageResult
            {
                StatusCode = StatusCodes.Status401Unauthorized,
                ErrorMessage = "Unauthorized"
            };
        }
        var messages = await dbContext.Messages
         .Where(m => m.ChatRoomId == chatRoomId)
         .OrderByDescending(m => m.Timestamp)
         .Skip((pageNumber-1) * pageSize)
         .Take(pageSize)
         .Select(m => new
         {
             Message = m,
             User = dbContext.Users
                 .Where(u => u.Id == m.SenderId)
                 .FirstOrDefault(),
            Attachments = dbContext.Attachments
                .Where(a => a.MessageId == m.Id)
                .OrderBy(a => a.Id)
                .ToList(),
            Emoji = dbContext.Emojis
                .Where(e => e.MessageId  == m.Id)
                .OrderBy(e => e.Id)
                .ToList()
         })
         .OrderBy(m =>m.Message.Timestamp)
         .AsNoTracking()
         .ToListAsync();

        var results = messages.Select(m => m.Message.AsDto(m.User, m.Attachments, m.Emoji)).ToList();
        return new MessageResult
        {
            Messages = results,
            StatusCode = StatusCodes.Status200OK
        };
    }
}
