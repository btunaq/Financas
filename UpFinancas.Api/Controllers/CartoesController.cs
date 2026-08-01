using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using UpFinancas.Api.Data;
using UpFinancas.Api.Models;

namespace UpFinancas.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CartoesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CartoesController(AppDbContext db)
        {
            _db = db;
        }

        private int ObterIdUsuarioLogado()
        {
            var claimId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.Parse(claimId!);
        }

        [HttpGet]
        public async Task<IActionResult> GetCartoes()
        {
            var cartoes = await _db.CartoesDeCredito
                                   .Where(c => c.UsuarioId == ObterIdUsuarioLogado())
                                   .ToListAsync();
            return Ok(cartoes);
        }

        [HttpPost]
        public async Task<IActionResult> AdicionarCartao([FromBody] CartaoDeCredito cartao)
        {
            cartao.UsuarioId = ObterIdUsuarioLogado();
            _db.CartoesDeCredito.Add(cartao);
            await _db.SaveChangesAsync();
            return Ok(cartao);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> ExcluirCartao(int id)
        {
            var cartao = await _db.CartoesDeCredito.FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == ObterIdUsuarioLogado());
            if (cartao is null) return NotFound();

            _db.CartoesDeCredito.Remove(cartao);
            await _db.SaveChangesAsync();
            return Ok();
        }

        // ==========================================
        // NOVA FUNÇÃO DE EDIÇÃO (PUT) ADICIONADA AQUI
        // ==========================================
        [HttpPut("{id:int}")]
        public async Task<IActionResult> EditarCartao(int id, [FromBody] CartaoDeCredito cartaoAtualizado)
        {
            // 1. Procura o cartão garantindo que pertence ao usuário logado
            var cartaoExistente = await _db.CartoesDeCredito.FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == ObterIdUsuarioLogado());
            
            if (cartaoExistente is null) 
            {
                return NotFound(new { erro = "Cartão não encontrado ou não pertence a este usuário." });
            }

            // 2. Atualiza os dados com o que veio do React
            cartaoExistente.NomeBanco = cartaoAtualizado.NomeBanco;
            cartaoExistente.NumeroFinal = cartaoAtualizado.NumeroFinal;
            cartaoExistente.CorHexadecimal = cartaoAtualizado.CorHexadecimal;
            cartaoExistente.DiaFechamento = cartaoAtualizado.DiaFechamento;
            cartaoExistente.DiaPagamento = cartaoAtualizado.DiaPagamento;

            // 3. Salva no banco de dados
            _db.CartoesDeCredito.Update(cartaoExistente);
            await _db.SaveChangesAsync();

            return Ok(cartaoExistente);
        }
    }
}