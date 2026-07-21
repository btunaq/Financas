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
    }
}