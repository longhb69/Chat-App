using ChatApplication.Data;
using ChatApplication.Dtos;
using ChatApplication.Repositories;
using System.Data.Entity;
namespace ChatApplication.Models;

public static class ModelExtensions
{
    public static MessageDto AsDto(this Message message, User user, List<Attachment> attachments)
    {
        var attachmentDtos = attachments.Select(a => new AttachemntDto
        {
            Id = a.Id,
            Name = a.Name,
            FileType = a.FileType,
            Width = a.Width,
            Height = a.Height,
            Url = a.Url,
        }).ToList();

        return new MessageDto
        {
            Id = message.Id,
            SenderId = message.SenderId,
            User = user?.AsDto(),
            ReceiverId = message.ReceiverId,
            Content = message.Content,
            Timestamp = message.Timestamp,
            Attachments = attachmentDtos,
            Emojis = message.Emojis
        };
    }
    public static ChatRoomDto AsDto(this ChatRoom room)
    {
        return new ChatRoomDto
        {
            Id = room.Id,
            Name = room.Name,
            Description = room.Description,
            IsPrivate = room.IsPrivate,
            ImageUrl = room.ImageUrl
        };
    }
    public static UserDto AsDto(this User user)
    {
        return new UserDto
        {
            Id = user.Id,
            UserName = user.UserName,
            AvatarUrl = user.AvatarUrl,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
        };
    }
    public static AttachemntDto AsDto(this Attachment attachment)
    {
        return new AttachemntDto
        {
            Id = attachment.Id,
            Name = attachment.Name,
            FileType = attachment.FileType, 
            Width = attachment.Width,   
            Height = attachment.Height,
            Url = attachment.Url,
        };
    }
}
