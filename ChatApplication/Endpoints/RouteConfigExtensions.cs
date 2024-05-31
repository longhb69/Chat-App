using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace ChatApplication.Endpoints;

public static class RouteConfigExtensions
{
    public static void UseChatRoomEndpoints(this IEndpointRouteBuilder endpoints)
    {
        ChatRoomEndpoints.ConfigureRoutes(endpoints);
    } 
    public static void UseUserChatRoomEndpoints(this IEndpointRouteBuilder endpoints)
    {
        UserChatRoomEndpoints.ConfigureRoutes(endpoints);
    }
    public static void UseMessageEndpoints(this IEndpointRouteBuilder endpoints)
    {
        MessageEndpoints.ConfigureRoutes(endpoints);
    }
    public static void UseUserEndpoints(this IEndpointRouteBuilder endpoints)
    {
        UserEndpoints.ConfigureRoutes(endpoints);
    }
    public static void UseFriendShipEndPoints(this IEndpointRouteBuilder endpoints)
    {
        FriendShipEndpoints.ConfigureRoutes(endpoints);
    }
    public static void UseTestEndpoints(this IEndpointRouteBuilder endpoints)
    {
        TestEndpoints.ConfigureRoutes(endpoints);
    }
    public static void UseEmojiEndpoints(this IEndpointRouteBuilder endpoints)
    {
        EmojiEndpoints.ConfigureRoutes(endpoints);
    }
}
