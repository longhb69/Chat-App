using ChatApplication.Repositories;
namespace ChatApplication.Endpoints;

public static class MessageEndpoints
{
    public static void ConfigureRoutes(this IEndpointRouteBuilder endpoins)
    {
        endpoins.MapGet("api/message_for_chatroom/{chatroomId}", async (long chatroomId, int? pageNumber, int? pageSize, IMessageRepository messageRepository) =>
        {
            int actualPageNumber = pageNumber ??= 1;
            int actualPageSize = pageSize ??= 30;
            var result = await messageRepository.GetMessagesForChatRoom(chatroomId, actualPageNumber, actualPageSize);

            if(result.StatusCode == StatusCodes.Status401Unauthorized)
            {
                return Results.StatusCode(StatusCodes.Status401Unauthorized);
            }
            else
            {
                return Results.Ok(result.Messages);
            }
        }).RequireAuthorization();

        endpoins.MapGet("api/message/{messageId}", async (long messageId, IMessageRepository messageRepository) =>
        {
            var result = await messageRepository.GetByIdAysnc(messageId);
            if(result.StatusCode == StatusCodes.Status200OK) {
                return Results.Ok(result.MessageDto);
            }
            else
            {
                return Results.StatusCode(result.StatusCode);
            }
        });
    } 

}
