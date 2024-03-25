using ChatApplication.Repositories;

namespace ChatApplication.Endpoints;

public static class UserEndpoints
{
    public static void ConfigureRoutes(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("api/user_by_name/{userName}", async (IUserRepository userRepository, string userName) =>  
        {
            var results = await userRepository.GetByUserNameAsync(userName);
            return Results.Ok(results);
        });
        endpoints.MapGet("api/user/{userId}", async (IUserRepository userRepository, string userId) =>
        {
            var results = await userRepository.GetById(userId);
            if (results.StatusCode == StatusCodes.Status200OK)
            {
                return Results.Ok(results.UserDto);
            }
            return Results.StatusCode(StatusCodes.Status404NotFound);
        });

    }
}
