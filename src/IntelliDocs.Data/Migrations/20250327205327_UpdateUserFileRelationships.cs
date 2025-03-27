using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IntelliDocs.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserFileRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserUserFile");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastLogin",
                table: "User",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "UserFileShare",
                columns: table => new
                {
                    FileId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFileShare", x => new { x.FileId, x.UserId });
                    table.ForeignKey(
                        name: "FK_UserFileShare_Files_FileId",
                        column: x => x.FileId,
                        principalTable: "Files",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserFileShare_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Files_AuthorId",
                table: "Files",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_UserFileShare_UserId",
                table: "UserFileShare",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_User_AuthorId",
                table: "Files",
                column: "AuthorId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_User_AuthorId",
                table: "Files");

            migrationBuilder.DropTable(
                name: "UserFileShare");

            migrationBuilder.DropIndex(
                name: "IX_Files_AuthorId",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "LastLogin",
                table: "User");

            migrationBuilder.CreateTable(
                name: "UserUserFile",
                columns: table => new
                {
                    FilesId = table.Column<int>(type: "int", nullable: false),
                    SharedUsersId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserUserFile", x => new { x.FilesId, x.SharedUsersId });
                    table.ForeignKey(
                        name: "FK_UserUserFile_Files_FilesId",
                        column: x => x.FilesId,
                        principalTable: "Files",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserUserFile_User_SharedUsersId",
                        column: x => x.SharedUsersId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_UserUserFile_SharedUsersId",
                table: "UserUserFile",
                column: "SharedUsersId");
        }
    }
}
