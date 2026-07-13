using Microsoft.EntityFrameworkCore;
using UpFinancas.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// =========================================================================
// 1. CONFIGURAÇÃO DOS SERVIÇOS (Injeção de Dependência)
// =========================================================================

// Ativa o suporte para Controllers no projeto
builder.Services.AddControllers();

// Configura o suporte ao Swagger (Documentação da API)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configura a conexão ao banco de dados MySQL via Pomelo Entity Framework Core
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// CONFIGURAÇÃO DO CORS: Permite que o React (porta 5173) consuma esta API (porta 5174)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactWeb", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
              .AllowAnyMethod()  // Permite GET, POST, PUT, DELETE, etc.
              .AllowAnyHeader(); // Permite qualquer cabeçalho HTTP
    });
});

var app = builder.Build();

// =========================================================================
// 2. CONFIGURAÇÃO DO PIPELINE DE REQUISIÇÕES HTTP (Middlewares)
// =========================================================================

// Ativa o Swagger visual se o ambiente for de Desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// OBRIGATÓRIO: Ativa a política de CORS antes de rotear as requisições
app.UseCors("AllowReactWeb");

app.UseAuthorization();

// Mapeia automaticamente todas as rotas definidas dentro da pasta Controllers
app.MapControllers();

app.Run();