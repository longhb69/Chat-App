using ChatApplication.Migrations;
using ChatApplication.Models;
using ChatApplication.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Web;

namespace ChatApplication.Endpoints;

public static class EmojiEndpoints
{
    const string GetEmojiEndpointName = "GetEmoji";
    public static void ConfigureRoutes(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("api/emoji/{emojiId}", async (IEmojiRepository emojiRepository, long emojiId) =>
        {
            var emoji = await emojiRepository.GetByIdAsync(emojiId);
            if(emoji != null)
            {
                return Results.Ok(emoji);
            }
            return Results.NotFound();
        }).WithName(GetEmojiEndpointName);

        endpoints.MapPost("api/emoji/{userId}/{messageId}/{symbol}/{imageUrl}", async (IEmojiRepository emojiRepository, string userId, long messageId, string symbol, string imageUrl) => {
            
            string decodedImageUrl = HttpUtility.UrlDecode(imageUrl);

            Emoji emoji = new()
            {
                UserId = userId,
                MessageId = messageId,
                EmojiSymbol = symbol,
                imageUrl = decodedImageUrl
            };
            Emoji createdEmoji = await emojiRepository.AddAsync(emoji);
            return Results.CreatedAtRoute(GetEmojiEndpointName, new { emojiId = createdEmoji.Id }, createdEmoji);
        });

        endpoints.MapPut("api/emoji/{emojiId}", async (IEmojiRepository emojiRepository, long emojiId) => {
            await emojiRepository.DeleteAsync(emojiId);
            return Results.Ok();  
        });
    }
}
