// ContaFixa.cs
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace UpFinancas.Api.Models
{
    public class ContaFixa
    {
        public int Id { get; set; }
        
        [Required]
        public int UsuarioId { get; set; }
        
        [Required]
        public string Nome { get; set; } = string.Empty;
        
        public decimal ValorEstimado { get; set; }
        public string TipoIcone { get; set; } = "casa";

        // Relacionamento com o Histórico (1 Conta tem Vários Históricos)
        public List<HistoricoConta> Historico { get; set; } = new();

        [JsonIgnore]
        public Usuario? Usuario { get; set; }
    }
}