using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace ChatApplication.Repositories;

public class CustomUserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        var userIdClaim = connection.User?.FindFirst(ClaimTypes.NameIdentifier);

        return userIdClaim?.Value;
    }
}
