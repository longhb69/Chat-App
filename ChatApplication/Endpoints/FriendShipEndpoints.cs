using ChatApplication.Repositories;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace ChatApplication.Endpoints;

public static class FriendShipEndpoints
{
    public static void ConfigureRoutes(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("api/friendship/{requesterId}/{targetUserId}", async (IFriendShipRepository friendShipRepository, string requesterId, string targetUserId) =>
        {
            try
            {
                await friendShipRepository.FriendRequest(requesterId, targetUserId);
                return Results.Ok();
            } catch
            {
                return Results.BadRequest();
            }
        });
        endpoints.MapPost("api/friendship/acceptedRequest/{requesterId}/{targetUserId}", async (IFriendShipRepository friendShipRepository, string requesterId, string targetUserId) =>
        {
            try
            {
                await friendShipRepository.AcceptedRequest(requesterId, targetUserId);
                return Results.Ok();
            }
            catch
            {
                return Results.BadRequest();
            }
        });
    }
}
