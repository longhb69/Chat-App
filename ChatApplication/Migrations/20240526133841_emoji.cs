using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApplication.Migrations
{
    public partial class emoji : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Emojis_Messages_MessageId",
                table: "Emojis");

            migrationBuilder.DropColumn(
                name: "ChatMessageId",
                table: "Emojis");

            migrationBuilder.AlterColumn<long>(
                name: "MessageId",
                table: "Emojis",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Emojis_UserId",
                table: "Emojis",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Emojis_AspNetUsers_UserId",
                table: "Emojis",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Emojis_Messages_MessageId",
                table: "Emojis",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Emojis_AspNetUsers_UserId",
                table: "Emojis");

            migrationBuilder.DropForeignKey(
                name: "FK_Emojis_Messages_MessageId",
                table: "Emojis");

            migrationBuilder.DropIndex(
                name: "IX_Emojis_UserId",
                table: "Emojis");

            migrationBuilder.AlterColumn<long>(
                name: "MessageId",
                table: "Emojis",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<string>(
                name: "ChatMessageId",
                table: "Emojis",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Emojis_Messages_MessageId",
                table: "Emojis",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "Id");
        }
    }
}
