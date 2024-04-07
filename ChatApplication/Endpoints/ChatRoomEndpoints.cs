using ChatApplication.Dtos;
using ChatApplication.Models;
using ChatApplication.Repositories;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace ChatApplication.Endpoints;

public static class ChatRoomEndpoints
{
    const string GetChatRoomEndpointName = "GetChatRoom";

    public static void ConfigureRoutes(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("api/chatroom", async (IChatRoomRepository chatRoomRepository) =>
        {
            var chatrooms = await chatRoomRepository.GetAllAsync();
            return Results.Ok(chatrooms);
        });

        endpoints.MapGet("api/chatroom/{chatRoomId}", async (IChatRoomRepository chatRoomRepository, long chatRoomId) =>
        {
             var chatroom = await chatRoomRepository.GetByIdAsync(chatRoomId);
             if(chatroom is null)
             {
                return Results.NotFound();
             }
             return Results.Ok(chatroom);

        }).RequireAuthorization()
        .WithName(GetChatRoomEndpointName);

        endpoints.MapPost("api/chatroom", async (HttpContext context, IChatRoomRepository chatRoomRepository, CreateChatRoomdto chatroomDto) =>
        {
            ChatRoom new_chatroom = new()
            {
                Name = chatroomDto.Name,
                CreatedAt = DateTime.UtcNow,
                IsPrivate = false,
                ImageUrl = chatroomDto.ImageUrl,
                OwnerId = chatroomDto.OwnerId,
            };
            ChatRoomDto createdChatRoom = await chatRoomRepository.AddAsync(new_chatroom);

            return Results.CreatedAtRoute(GetChatRoomEndpointName, new { chatRoomId = createdChatRoom.Id }, createdChatRoom);
        }).RequireAuthorization();

        endpoints.MapDelete("api/chatroom/{chatRoomId}", async (HttpContext context, IChatRoomRepository chatRoomRepository, long chatRoomId) =>
        {

            var result = await chatRoomRepository.DeleteAsync(chatRoomId);
            if (result.StatusCode == StatusCodes.Status404NotFound)
            {
                return Results.StatusCode(StatusCodes.Status404NotFound);
            }
            else if (result.StatusCode == StatusCodes.Status401Unauthorized)
            {
                return Results.StatusCode(StatusCodes.Status401Unauthorized);
            }
            else
            {
                return Results.StatusCode(StatusCodes.Status204NoContent);
            }
        }).RequireAuthorization();
    }
}
