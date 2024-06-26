using ChatApplication.Models;

namespace ChatApplication.Repositories;

public interface IEmojiRepository
{
    Task<Emoji> AddAsync(Emoji emoji);
    Task DeleteAsync(long emojiId);
    Task<Emoji> GetByIdAsync(long emojiId);
}
