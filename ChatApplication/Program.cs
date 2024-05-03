using ChatApplication.Data;
using ChatApplication.DataService;
using ChatApplication.Models;
using ChatApplication.Repositories;
using Microsoft.EntityFrameworkCore;
using ChatApplication.Endpoints;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("AuthDbContextConnection") ?? throw new InvalidOperationException("Connection string 'AuthDbContextConnection' not found.");


builder.Services.AddRazorPages();

// Add services to the container.
builder.Host.ConfigureLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
});
builder.Services.AddAuthorization();
builder.Services.AddSignalR();
builder.Services.AddCors(); 
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<ShareDB>();


builder.Services.AddRepositories(builder.Configuration);
builder.Services.AddSingleton<IDictionary<string, UserConnection>>(opts => new Dictionary<string, UserConnection>());



var app = builder.Build();
app.UseCors(builder =>
    builder.AllowAnyHeader()
           .AllowAnyMethod()
           .AllowCredentials()
           .WithOrigins("http://192.168.1.3:3000"));

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseChatRoomEndpoints();
app.UseUserChatRoomEndpoints();
app.UseMessageEndpoints();
app.UseUserEndpoints();
app.UseFriendShipEndPoints();
app.UseTestEndpoints();

app.MapHub<ChatHub>(pattern: "/chat");
app.MapRazorPages();
app.UseCors("reactApp");
app.Run();

//dotnet ef migrations add ...
