using ChatApplication.Areas.Identity.Data;
using ChatApplication.Models;
using ChatApplication.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ChatApplication.Data;

public static class DataExtensions
{
    public static IServiceCollection AddRepositories(this IServiceCollection services, IConfiguration configuration)
    {
        var connString = configuration.GetConnectionString("AuthDbContextConnection");
        services.AddDbContext<ChatApplicationContext>(options => options.UseNpgsql(connString))
            .AddSingleton<IUserIdProvider, CustomUserIdProvider>()
            .AddScoped<IMessageRepository, EntityFrameworkMessageRepository>()
            .AddScoped<IChatRoomRepository, FrameworkChatRoomRepository>()
            .AddScoped<IUserRepository, FrameworkUserRepository>()
            .AddScoped<IUserChatRoomRepository, FrameworkUserChatRoomRepository>()
            .AddScoped<IStorage, FrameworkStorageRepository>()
            .AddScoped<IS3Client, FrameworkS3ClientRepository>()
            .AddScoped<IThumbnailGenerator, FrameworkThumbnailGenerator>()
            .AddIdentity<User, IdentityRole>(options =>
            {
                options.SignIn.RequireConfirmedAccount = true;
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
            })
            .AddEntityFrameworkStores<ChatApplicationContext>()
            .AddDefaultTokenProviders();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidAudience = configuration["JWT:ValidAudience"],
                ValidIssuer = configuration["JWT:ValidIssuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"])),
                LifetimeValidator = (notBefore, expires, token, validationParameters) =>
                {
                    return ((expires > DateTime.UtcNow) && (expires <= DateTime.UtcNow.AddHours(24)));
                }
            };
        });
        services.AddHttpContextAccessor();
        return services;
    }
}
