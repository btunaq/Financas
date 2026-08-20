using Microsoft.EntityFrameworkCore;
using UpFinancas.Api.Models;

namespace UpFinancas.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<CartaoDeCredito> CartoesDeCredito { get; set; }
        public DbSet<CompraCartao> ComprasCartao { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<ContaFixa> ContasFixas { get; set; }
        public DbSet<HistoricoConta> HistoricosContas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // O ficheiro agora está limpo! 
            // O banco de dados vai nascer vazio no Docker dos teus colegas,
            // e eles terão de criar a própria conta pela tela de "Criar Conta".
            
            base.OnModelCreating(modelBuilder);
        }
    }
}