using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using UpFinancas.Api.Data;
using UpFinancas.Api.Models;

namespace UpFinancas.Api.Controllers
{
    [Authorize] // <-- Bloqueia o acesso sem Token!
    [ApiController]
    [Route("api/[controller]")]
    public class ComprasController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ComprasController(AppDbContext db)
        {
            _db = db;
        }

        // Método inteligente que extrai o ID protegido de dentro do JWT
        private int ObterIdUsuarioLogado()
        {
            var claimId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.Parse(claimId!);
        }

        [HttpGet]
        public async Task<IActionResult> GetCompras()
        {
            int usuarioId = ObterIdUsuarioLogado();

            var comprasDto = await _db.ComprasCartao
                .Where(c => c.UsuarioId == usuarioId) // Só as tuas compras!
                .Select(c => new {
                    c.Id,
                    c.Titular,
                    c.Descricao,
                    c.ValorTotal,
                    c.ParcelaAtual,
                    c.QuantidadeParcelas,
                    c.DataCompra,
                    c.FoiPago,
                    c.Categoria,
                    c.MesesPagos,
                    c.CartaoDeCreditoId,
                    CartaoDeCredito = c.CartaoDeCredito != null ? new {
                        c.CartaoDeCredito.Id,
                        c.CartaoDeCredito.NomeBanco,
                        c.CartaoDeCredito.CorHexadecimal,
                        c.CartaoDeCredito.NumeroFinal,
                        c.CartaoDeCredito.DiaFechamento,
                        c.CartaoDeCredito.DiaPagamento
                    } : null
                })
                .ToListAsync();

            return Ok(comprasDto);
        }

        [HttpPost]
        public async Task<IActionResult> AdicionarCompra([FromBody] CompraCartao compra)
        {
            compra.UsuarioId = ObterIdUsuarioLogado(); // Carimba a compra automaticamente
            _db.ComprasCartao.Add(compra);
            await _db.SaveChangesAsync();
            return Ok(compra);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> EditarCompra(int id, [FromBody] CompraAtualizadaDto dados)
        {
            int usuarioId = ObterIdUsuarioLogado();
            
            // Procura a compra e garante que ela é TUA antes de editar
            var compra = await _db.ComprasCartao.FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == usuarioId);
            if (compra is null) return NotFound("Compra não encontrada ou acesso negado.");

            compra.Titular = dados.Titular;
            compra.Descricao = dados.Descricao;
            compra.ValorTotal = dados.ValorTotal;
            compra.ParcelaAtual = dados.ParcelaAtual;
            compra.QuantidadeParcelas = dados.QuantidadeParcelas;
            compra.DataCompra = dados.DataCompra;
            compra.CartaoDeCreditoId = dados.CartaoDeCreditoId;
            compra.FoiPago = dados.FoiPago;
            compra.Categoria = dados.Categoria;
            compra.MesesPagos = dados.MesesPagos;

            await _db.SaveChangesAsync();
            return Ok(compra);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> ExcluirCompra(int id)
        {
            int usuarioId = ObterIdUsuarioLogado();
            
            var compra = await _db.ComprasCartao.FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == usuarioId);
            if (compra is null) return NotFound();

            _db.ComprasCartao.Remove(compra);
            await _db.SaveChangesAsync();
            return Ok();
        }
    }

    public record CompraAtualizadaDto(
        string Titular, string Descricao, decimal ValorTotal, 
        int ParcelaAtual, int QuantidadeParcelas, DateTime DataCompra, 
        int CartaoDeCreditoId, bool FoiPago, string Categoria, string? MesesPagos
    );
}