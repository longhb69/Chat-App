using ChatApplication.Dtos;
using ChatApplication.Models;
using ChatApplication.Respone;

namespace ChatApplication.Repositories;

public interface IUserRepository
{
    Task<UserRespone> GetById(string id);
    Task<ICollection<UserDto>> GetByUserNameAsync(string userName);
}
