using ChatApplication.Repositories;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace ChatApplication.Endpoints;

public static class TestEndpoints
{
    public static void ConfigureRoutes(this IEndpointRouteBuilder endpoins)
    {
        endpoins.MapGet("test", async (IChatRoomRepository repo) =>
        {
            var data = await repo.GetAllAsync();
            return Results.Ok(data);
        });
    }

}
