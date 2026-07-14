using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpFinancas.Api.Data; 
using UpFinancas.Api.Models; 

namespace UpFinancas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartoesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CartoesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetCartoes()
        {
            var cartoes = await _db.Cartoes.ToListAsync();
            return Ok(cartoes);
        }

       [HttpPost]
    public async Task<IActionResult> AdicionarCartao([FromBody] CartaoDeCredito cartao)
    {
        // Verifica se já existe um cartão com o mesmo banco e o mesmo final
        bool cartaoExiste = await _db.Cartoes.AnyAsync(c => 
            c.NomeBanco.ToLower() == cartao.NomeBanco.ToLower() && 
            c.NumeroFinal == cartao.NumeroFinal);

        if (cartaoExiste)
        {
            // Retorna o Erro 400 (Bad Request) com uma mensagem clara
            return BadRequest("Já existe um cartão registado com este mesmo banco e dígitos finais.");
        }

        _db.Cartoes.Add(cartao);
        await _db.SaveChangesAsync();
        return Ok(cartao);
}

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