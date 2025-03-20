using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IntelliDocs.Data.Migrations
{
    /// <inheritdoc />
    public partial class initCloudDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_Files_UserFileId",
                table: "Files");

            migrationBuilder.DropIndex(
                name: "IX_Files_UserFileId",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "UserFileId",
                table: "Files");

            migrationBuilder.AddColumn<int>(
                name: "UserFileId",
                table: "User",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_UserFileId",
                table: "User",
                column: "UserFileId");

            migrationBuilder.AddForeignKey(
                name: "FK_User_Files_UserFileId",
                table: "User",
                column: "UserFileId",
                principalTable: "Files",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Files_UserFileId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_UserFileId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "UserFileId",
                table: "User");

            migrationBuilder.AddColumn<int>(
                name: "UserFileId",
                table: "Files",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Files_UserFileId",
                table: "Files",
                column: "UserFileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_Files_UserFileId",
                table: "Files",
                column: "UserFileId",
                principalTable: "Files",
                principalColumn: "Id");
        }
    }
}
