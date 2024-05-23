using ChatApplication.Repositories;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace ChatApplication.Endpoints;

public static class FriendShipEndpoints
{
    public static void ConfigureRoutes(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("api/friendship/{targetUserId}", async (IFriendShipRepository friendShipRepository, string targetUserId) => {
            var users = await friendShipRepository.GetFriendRequest(targetUserId);
            if (users != null)
            {
                return Results.Ok(users);
            }
            return Results.Ok();
        });
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
        endpoints.MapGet("api/checkFriendship/{requesterId}/{targetUserId}", async (IFriendShipRepository friendShipRepository, string requesterId, string targetUserId) =>
        {
            var status = friendShipRepository.CheckFriendShip(requesterId, targetUserId);
            if(status != null)
            {
                return Results.Ok(status.Result);  
            }
            return Results.Ok();
        });
    }
}
