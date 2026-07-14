using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpFinancas.Api.Data;
using UpFinancas.Api.Models;

namespace UpFinancas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComprasController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ComprasController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetCompras()
        {
            var comprasDto = await _db.ComprasCartao
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
            _db.ComprasCartao.Add(compra);
            await _db.SaveChangesAsync();
            return Ok(compra);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> EditarCompra(int id, [FromBody] CompraAtualizadaDto dados)
        {
            var compra = await _db.ComprasCartao.FindAsync(id);
            if (compra is null) return NotFound("Compra não encontrada.");

            compra.Titular = dados.Titular;
            compra.Descricao = dados.Descricao;
            compra.ValorTotal = dados.ValorTotal;
            compra.ParcelaAtual = dados.ParcelaAtual;
            compra.QuantidadeParcelas = dados.QuantidadeParcelas;
            compra.DataCompra = dados.DataCompra;
            compra.CartaoDeCreditoId = dados.CartaoDeCreditoId;
            compra.FoiPago = dados.FoiPago;
            compra.Categoria = dados.Categoria;

            await _db.SaveChangesAsync();
            return Ok(compra);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> ExcluirCompra(int id)
        {
            var compra = await _db.ComprasCartao.FindAsync(id);
            if (compra is null) return NotFound();

            _db.ComprasCartao.Remove(compra);
            await _db.SaveChangesAsync();
            return Ok();
        }
    }

    public record CompraAtualizadaDto(
        string Titular, string Descricao, decimal ValorTotal, 
        int ParcelaAtual, int QuantidadeParcelas, DateTime DataCompra, 
        int CartaoDeCreditoId, bool FoiPago, string Categoria
    );
}