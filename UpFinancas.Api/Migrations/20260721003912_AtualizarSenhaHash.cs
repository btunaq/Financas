using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UpFinancas.Api.Migrations
{
    /// <inheritdoc />
    public partial class AtualizarSenhaHash : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ComprasCartao_Cartoes_CartaoDeCreditoId",
                table: "ComprasCartao");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Cartoes",
                table: "Cartoes");

            migrationBuilder.RenameTable(
                name: "Cartoes",
                newName: "CartoesDeCredito");

            migrationBuilder.AlterColumn<string>(
                name: "MesesPagos",
                table: "ComprasCartao",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "UsuarioId",
                table: "ComprasCartao",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "UsuarioId",
                table: "CartoesDeCredito",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CartoesDeCredito",
                table: "CartoesDeCredito",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Senha = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Id", "Email", "Nome", "Senha" },
                values: new object[] { 1, "bruna@upfinancas.com", "Bruna Raquel", "$2a$11$t.T2y.9MSJAEPjj1XswVbOOt97JA7AAJxG3.MYObv.aF9YUjS6RBu" });

            migrationBuilder.AddForeignKey(
                name: "FK_ComprasCartao_CartoesDeCredito_CartaoDeCreditoId",
                table: "ComprasCartao",
                column: "CartaoDeCreditoId",
                principalTable: "CartoesDeCredito",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ComprasCartao_CartoesDeCredito_CartaoDeCreditoId",
                table: "ComprasCartao");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CartoesDeCredito",
                table: "CartoesDeCredito");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "ComprasCartao");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "CartoesDeCredito");

            migrationBuilder.RenameTable(
                name: "CartoesDeCredito",
                newName: "Cartoes");

            migrationBuilder.UpdateData(
                table: "ComprasCartao",
                keyColumn: "MesesPagos",
                keyValue: null,
                column: "MesesPagos",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "MesesPagos",
                table: "ComprasCartao",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Cartoes",
                table: "Cartoes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ComprasCartao_Cartoes_CartaoDeCreditoId",
                table: "ComprasCartao",
                column: "CartaoDeCreditoId",
                principalTable: "Cartoes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
