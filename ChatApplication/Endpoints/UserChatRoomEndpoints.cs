using ChatApplication.Repositories;

namespace ChatApplication.Endpoints;

public static class UserChatRoomEndpoints
{
    public static void ConfigureRoutes(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("api/userchatroom/{userId}", async (string userId, IUserChatRoomRepository userChatRoomRepository) =>
        {
            var chatRooms = await userChatRoomRepository.GetRoomsByUserId(userId);
            return Results.Ok(chatRooms);
        });
        endpoints.MapPost("api/userchatroom/{userId}/{chatRoomId}/{senderId}", async (string userId, long chatRoomId, string senderId, IUserChatRoomRepository userChatRoomRepository) =>
        {
            var result = await userChatRoomRepository.AddUserToRoom(userId, chatRoomId, senderId);
            if (result.StatusCode == StatusCodes.Status201Created)
            {
                return Results.StatusCode(StatusCodes.Status201Created);
            }
            else if (result.StatusCode == StatusCodes.Status401Unauthorized)
            {
                return Results.StatusCode(StatusCodes.Status401Unauthorized);
            }
            return Results.Ok();
        });
    }
}
