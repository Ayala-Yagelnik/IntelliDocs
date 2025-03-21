using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IntelliDocs.Data.Migrations
{
    /// <inheritdoc />
    public partial class fixRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_User_AuthorId",
                table: "Files");

            migrationBuilder.DropForeignKey(
                name: "FK_User_Files_UserFileId",
                table: "User");

            migrationBuilder.DropForeignKey(
                name: "FK_User_Roles_RoleId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_UserFileId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_Files_AuthorId",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "UserFileId",
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

            migrationBuilder.AddForeignKey(
                name: "FK_User_Roles_RoleId",
                table: "User",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Roles_RoleId",
                table: "User");

            migrationBuilder.DropTable(
                name: "UserUserFile");

            migrationBuilder.AddColumn<int>(
                name: "UserFileId",
                table: "User",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_UserFileId",
                table: "User",
                column: "UserFileId");

            migrationBuilder.CreateIndex(
                name: "IX_Files_AuthorId",
                table: "Files",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_User_AuthorId",
                table: "Files",
                column: "AuthorId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_User_Files_UserFileId",
                table: "User",
                column: "UserFileId",
                principalTable: "Files",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_User_Roles_RoleId",
                table: "User",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
