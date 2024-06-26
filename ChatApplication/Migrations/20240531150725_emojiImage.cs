using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApplication.Migrations
{
    public partial class emojiImage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "imageUrl",
                table: "Emojis",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "imageUrl",
                table: "Emojis");
        }
    }
}
