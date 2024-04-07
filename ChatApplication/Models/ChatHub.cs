using ChatApplication.DataService;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
namespace ChatApplication.Models;

using ChatApplication.Data;
using ChatApplication.Dtos;
using ChatApplication.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Security.Claims;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ChatHub : Hub
{
    private readonly ShareDB _shared;
    private readonly ILogger<ChatHub> _logger;
    private readonly IDictionary<string, UserConnection> _connections;
    private readonly IMessageRepository _messageRepository;
    private readonly IChatRoomRepository _chatRoomRepository;
    private readonly IUserChatRoomRepository _userChatRoomRepository;
    private readonly ChatApplicationContext _dbContext;
    private readonly IUserRepository _userRepository;
    private readonly UserManager<User> _userManager;    


    public ChatHub(ShareDB shared, IDictionary<string, UserConnection> connections, ILogger<ChatHub> logger, 
                    IMessageRepository messageRepository, IChatRoomRepository chatRoomRepository, IUserRepository userRepository, IUserChatRoomRepository userChatRoomRepository,
                    ChatApplicationContext dbContext, UserManager<User> userManager)
    {
        _shared = shared;
        _connections = connections;
        _logger = logger;
        _messageRepository = messageRepository;
        _chatRoomRepository = chatRoomRepository;
        _userRepository = userRepository;   
        _userChatRoomRepository = userChatRoomRepository;
        _dbContext = dbContext;
        _userManager = userManager;

    }

    public string GetConnectionId()
    {
        return Context.ConnectionId;
    }
    public override async Task OnConnectedAsync()
    {
        var user = await _userManager.FindByNameAsync(Context.User.FindFirstValue(ClaimTypes.Name));
        _shared.connections2[Context.ConnectionId] = new UserConnection2(user.Id, -1);
        _shared.userConnectionMap[user.Id] = Context.ConnectionId;
        LogConnectedUsers();
        await base.OnConnectedAsync();
    }
    public override Task OnDisconnectedAsync(Exception? exception)
    {
        if (_shared.connections2.TryGetValue(Context.ConnectionId, out UserConnection2 conn))
        {
            _shared.connections2.TryRemove(Context.ConnectionId, out _);
            _shared.userConnectionMap.TryRemove(conn.UserId, out _);
        }
        return base.OnDisconnectedAsync(exception);
    }

    private void LogConnectedUsers()
    {
        foreach (var connection in _shared.userConnectionMap)
        {
            var userConnectionJson = JsonConvert.SerializeObject(connection);
            _logger.LogInformation($"Connected User: {userConnectionJson}");
        }
    }

    public async Task<string> GetConnectionIdByUserId(string userId)
    {
        if(_shared.userConnectionMap.TryGetValue(userId, out var connectionId)) //return bool
        {
            return connectionId;
        }
        else
        {
            return null;
        }
    }
public async Task<long> SendMessage(string message)
    {
        long messageId = 0;
        if (_shared.connections2.TryGetValue(Context.ConnectionId, out UserConnection2 conn))
        {
            var user = await _userRepository.GetById(conn.UserId);
            var new_message = new Message
            {
                Content = message,
                SenderId = user.UserDto.Id,
                ChatRoomId = conn.ChatRoomId,
                Timestamp = DateTime.UtcNow,
            };
            messageId = await _messageRepository.Add(new_message);
            await Clients.Group("ChatRoom_" + conn.ChatRoomId)
                   .SendAsync("ReceiveMessage", messageId, user.UserDto.UserName, message, DateTime.UtcNow);
        }
        return messageId;
    }
    public async Task NotifyAttachment(long chatRoomId, long messageId)
    {
        await Clients.Group("ChatRoom_" + chatRoomId)
                       .SendAsync("ReceiveAttachment", messageId);
    }

    public async Task JoinChat(UserConnection conn) 
    {
        await Clients.All
            .SendAsync("ReceiveMessage", "admin", $"{conn.UserName} has joined"); 
    }

    public async Task JoinRoom(UserConnection2 conn)
    {
        var room = await _chatRoomRepository.GetByIdAsync(conn.ChatRoomId);
        var user = await _userRepository.GetById(conn.UserId);
        string groupName = "ChatRoom_" + conn.ChatRoomId;

        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        if (_shared.connections2.TryGetValue(conn.UserId, out var existingConnection))
        {
            existingConnection.ChatRoomId = conn.ChatRoomId;
        }
        else
        {
            _shared.connections2[Context.ConnectionId] = conn;
        }

        await Clients.Group(groupName)
            .SendAsync("ReceiveMessage", "admin", $"{user.UserDto.UserName} has joined {room.Name}");
        await SendConnectedUsers(room.Id);      
    }

    public Task SendConnectedUsers(long roomId)
    {
        var users = _shared.connections2.Values
            .Where(c => c.ChatRoomId == roomId)
            .Select(c => c.UserId)
            .Distinct();

        string groupName = "ChatRoom_" + roomId;
        return Clients.Group(groupName).SendAsync("UsersInRoom", users);
    }
    public async Task OnUserAddedToRoom(UserConnection2 conn)
    {
        var userAddedConnectionId = await GetConnectionIdByUserId(conn.UserId);
        _logger.LogInformation(userAddedConnectionId);
        await Clients.Client(userAddedConnectionId).SendAsync("AddedToChatRoom", conn.ChatRoomId);
    }
}
