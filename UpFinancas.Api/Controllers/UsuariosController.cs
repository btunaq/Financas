using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpFinancas.Api.Data;
using UpFinancas.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace UpFinancas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UsuariosController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] RegistroDto dto)
        {
            if (await _db.Usuarios.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Este e-mail já está em uso.");

            // Criptografa a senha antes de salvar no banco
            string hashSenha = BCrypt.Net.BCrypt.HashPassword(dto.Senha);

            var usuario = new Usuario { Nome = dto.Nome, Email = dto.Email, Senha = hashSenha };
            _db.Usuarios.Add(usuario);
            await _db.SaveChangesAsync();

            return Ok(new { mensagem = "Conta criada com sucesso!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var usuario = await _db.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Email);
            
            // Verifica o e-mail e confere se a senha digitada bate com o Hash do banco
            if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.Senha))
                return Unauthorized("E-mail ou senha incorretos.");

            // Gera o Token JWT que durará 8 horas
            var tokenHandler = new JwtSecurityTokenHandler();
            var chave = Encoding.ASCII.GetBytes("ChaveSuperSecretaUpFinancas2026MuitoSegura!");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(chave), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // Devolve o Token e as informações básicas da pessoa (sem a senha, claro)
            return Ok(new { token = tokenString, usuario = new { usuario.Id, usuario.Nome, usuario.Email } });
        }

        // ==========================================
        // NOVA ROTA PARA ATUALIZAR DADOS (E-mail e Senha)
        // ==========================================
        [Authorize]
        [HttpPut("perfil")]
        public async Task<IActionResult> AtualizarPerfil([FromBody] AtualizarPerfilDto dto)
        {
            // Descobre quem é o utilizador logado pelo Token
            var claimId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (claimId == null) return Unauthorized();
            
            var id = int.Parse(claimId);
            var usuario = await _db.Usuarios.FindAsync(id);

            if (usuario == null) return NotFound("Usuário não encontrado.");

            // Atualiza o email se foi enviado um novo
            if (!string.IsNullOrEmpty(dto.Email))
            {
                usuario.Email = dto.Email;
            }

            // Atualiza a senha (com criptografia) se foi enviada uma nova
            if (!string.IsNullOrEmpty(dto.NovaSenha))
            {
                usuario.Senha = BCrypt.Net.BCrypt.HashPassword(dto.NovaSenha);
            }

            _db.Usuarios.Update(usuario);
            await _db.SaveChangesAsync();

            // Devolve os dados novos para atualizar a tela
            return Ok(new { nome = usuario.Nome, email = usuario.Email });
        }
    }

    public record RegistroDto(string Nome, string Email, string Senha);
    public record LoginDto(string Email, string Senha);
    public record AtualizarPerfilDto(string Email, string? NovaSenha);
}