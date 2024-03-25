namespace ChatApplication.Data;

using ChatApplication.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

public class ChatApplicationContext : IdentityDbContext<User>
{
    public ChatApplicationContext(DbContextOptions<ChatApplicationContext> options)
        : base(options)
    {
    }
    public class ChatApplicationContextFactory : IDesignTimeDbContextFactory<ChatApplicationContext>
    {
        public ChatApplicationContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ChatApplicationContext>();
            optionsBuilder.UseSqlServer("Server=DESKTOP-OFPP3MK;Database=ChatApplication;Trusted_Connection=True;TrustServerCertificate=True;");

            return new ChatApplicationContext(optionsBuilder.Options);
        }
    }

    public DbSet<Message> Messages => Set<Message>();
    public DbSet<ChatRoom> ChatRooms => Set<ChatRoom>();
    public DbSet<Attachment> Attachments => Set<Attachment>();
    public DbSet<Emoji> Emojis => Set<Emoji>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserChatRoom> userChatRooms => Set<UserChatRoom>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasOne(c => c.ChatRoom)
                .WithMany(m => m.Messages)
                .HasForeignKey(c => c.ChatRoomId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Attachment>(entity =>
        {
            entity.HasOne(a => a.Message)
                .WithMany(m => m.Attachments)
                .HasForeignKey(a => a.MessageId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ChatRoom>(entity =>
        {
            entity.HasOne(c => c.Owner)
                .WithMany(u => u.ChatRooms)
                .HasForeignKey(o => o.OwnerId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<UserChatRoom>(entity =>
        {
            entity.HasKey(uc => new { uc.ChatRoomId, uc.UserId });

            entity.HasOne(uc => uc.User)
                .WithMany(u => u.UserChatRoom)
                .HasForeignKey(uc => uc.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(uc => uc.ChatRoom)
               .WithMany(u => u.UserChatRoom)
               .HasForeignKey(uc => uc.ChatRoomId)
               .OnDelete(DeleteBehavior.Cascade);
        });

        base.OnModelCreating(modelBuilder);
    }
}
