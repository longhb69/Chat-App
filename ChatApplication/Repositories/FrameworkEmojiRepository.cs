using ChatApplication.Data;
using ChatApplication.Models;
using Microsoft.AspNetCore.Identity;

namespace ChatApplication.Repositories;

public class FrameworkEmojiRepository : IEmojiRepository
{
    private readonly ChatApplicationContext _dbContext;
    private readonly UserManager<User> _userManager;

    public FrameworkEmojiRepository(ChatApplicationContext dbContext, UserManager<User> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    public async Task<Emoji> AddAsync(Emoji emoji)
    {
        _dbContext.Emojis.Add(emoji);
        await _dbContext.SaveChangesAsync();
        return emoji;
    }

    public async Task DeleteAsync(long emojiId)
    {
        var emoji = await _dbContext.Emojis.FindAsync(emojiId);
        if (emoji != null)
        {
            _dbContext.Emojis.Remove(emoji);
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task<Emoji> GetByIdAsync(long emojiId)
    {
        var emoji = await _dbContext.Emojis.FindAsync(emojiId);
        if (emoji != null)
        {
            return emoji;
        }
        return null;
    }
}
