using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpFinancas.Api.Data;
using UpFinancas.Api.Models;
using System.Security.Claims;
using System.IO;

namespace UpFinancas.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ContasFixasController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ContasFixasController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        private int GetUsuarioId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // GET: Pega as contas e inclui os históricos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContaFixa>>> GetContasFixas()
        {
            return await _context.ContasFixas
                .Include(c => c.Historico)
                .Where(c => c.UsuarioId == GetUsuarioId())
                .ToListAsync();
        }

        // POST: Criar Conta
        [HttpPost]
        public async Task<ActionResult<ContaFixa>> PostContaFixa(ContaFixa conta)
        {
            conta.UsuarioId = GetUsuarioId();
            _context.ContasFixas.Add(conta);
            await _context.SaveChangesAsync();
            return Ok(conta);
        }

        // PUT: Editar Conta
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContaFixa(int id, ContaFixa conta)
        {
            if (id != conta.Id) return BadRequest();
            _context.Entry(conta).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: Excluir Conta (e o histórico vai junto)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContaFixa(int id)
        {
            // O Include garante que o banco não dê erro tentando apagar uma conta que tem faturas amarradas
            var conta = await _context.ContasFixas
                .Include(c => c.Historico)
                .FirstOrDefaultAsync(c => c.Id == id);
                
            if (conta == null || conta.UsuarioId != GetUsuarioId()) return NotFound();

            _context.ContasFixas.Remove(conta);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: Adicionar/Editar Histórico e fazer Upload do Comprovante
        [HttpPost("{id}/historico")]
        public async Task<IActionResult> LancarHistorico(int id, [FromForm] string mesAno, [FromForm] decimal valorPago, IFormFile? comprovante)
        {
            var conta = await _context.ContasFixas.Include(c => c.Historico).FirstOrDefaultAsync(c => c.Id == id);
            if (conta == null || conta.UsuarioId != GetUsuarioId()) return NotFound();

            var historico = conta.Historico.FirstOrDefault(h => h.MesAno == mesAno);
            
            if (historico == null)
            {
                historico = new HistoricoConta { ContaFixaId = id, MesAno = mesAno };
                _context.HistoricosContas.Add(historico);
            }

            historico.ValorPago = valorPago;
            historico.Status = "PAGO";

            // Se enviou um arquivo, salva com segurança lidando com o WebRoot nulo
            if (comprovante != null)
            {
                var rootPath = string.IsNullOrWhiteSpace(_env.WebRootPath) 
                    ? Path.Combine(_env.ContentRootPath, "wwwroot") 
                    : _env.WebRootPath;

                var pastaUpload = Path.Combine(rootPath, "uploads");
                
                if (!Directory.Exists(pastaUpload)) 
                {
                    Directory.CreateDirectory(pastaUpload);
                }

                var nomeArquivo = Guid.NewGuid().ToString() + Path.GetExtension(comprovante.FileName);
                var caminhoCompleto = Path.Combine(pastaUpload, nomeArquivo);

                using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
                {
                    await comprovante.CopyToAsync(stream);
                }

                historico.ComprovanteUrl = $"/uploads/{nomeArquivo}";
            }

            await _context.SaveChangesAsync();
            return Ok(historico);
        }

        // DELETE: Excluir item do histórico
        [HttpDelete("{id}/historico/{historicoId}")]
        public async Task<IActionResult> DeleteHistorico(int id, int historicoId)
        {
            var historico = await _context.HistoricosContas.FindAsync(historicoId);
            if (historico == null || historico.ContaFixaId != id) return NotFound();

            _context.HistoricosContas.Remove(historico);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}