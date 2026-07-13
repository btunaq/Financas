using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UpFinancas.Api.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarNumeroFinalCartao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NumeroFinal",
                table: "Cartoes",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumeroFinal",
                table: "Cartoes");
        }
    }
}
