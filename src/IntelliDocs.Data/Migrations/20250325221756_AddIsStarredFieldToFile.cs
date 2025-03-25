using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IntelliDocs.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddIsStarredFieldToFile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsStarred",
                table: "Files",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsStarred",
                table: "Files");
        }
    }
}
