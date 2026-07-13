using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UpFinancas.Api.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarDiasEStatusPagamento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FoiPago",
                table: "ComprasCartao",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParcelaAtual",
                table: "ComprasCartao",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DiaFechamento",
                table: "Cartoes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DiaPagamento",
                table: "Cartoes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FoiPago",
                table: "ComprasCartao");

            migrationBuilder.DropColumn(
                name: "ParcelaAtual",
                table: "ComprasCartao");

            migrationBuilder.DropColumn(
                name: "DiaFechamento",
                table: "Cartoes");

            migrationBuilder.DropColumn(
                name: "DiaPagamento",
                table: "Cartoes");
        }
    }
}
