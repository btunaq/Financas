using Microsoft.EntityFrameworkCore;
using UpFinancas.Api.Models;

namespace UpFinancas.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Aqui definimos as tabelas que serão criadas no banco
    public DbSet<CartaoDeCredito> Cartoes { get; set; }
    public DbSet<CompraCartao> ComprasCartao { get; set; }
}