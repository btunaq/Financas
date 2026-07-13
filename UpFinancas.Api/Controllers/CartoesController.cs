using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpFinancas.Api.Data; 
using UpFinancas.Api.Models; 

namespace UpFinancas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // O .NET transforma isto em "api/cartoes"
    public class CartoesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CartoesController(AppDbContext db)
        {
            _db = db;
        }

        // GET: api/cartoes
        [HttpGet]
        public async Task<IActionResult> GetCartoes()
        {
            var cartoes = await _db.Cartoes.ToListAsync();
            return Ok(cartoes);
        }

        // POST: api/cartoes
        [HttpPost]
        public async Task<IActionResult> AdicionarCartao([FromBody] CartaoDeCredito cartao)
        {
            _db.Cartoes.Add(cartao);
            await _db.SaveChangesAsync();
            return Ok(cartao);
        }

        // DELETE: api/cartoes/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> ExcluirCartao(int id)
        {
            var cartao = await _db.Cartoes.FindAsync(id);
            if (cartao is null) return NotFound("Cartão não encontrado.");

            _db.Cartoes.Remove(cartao);
            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}