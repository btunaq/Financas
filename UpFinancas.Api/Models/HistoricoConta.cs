// HistoricoConta.cs
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace UpFinancas.Api.Models
{
    public class HistoricoConta
    {
        public int Id { get; set; }
        
        [Required]
        public int ContaFixaId { get; set; }
        
        [Required]
        public string MesAno { get; set; } = string.Empty; // Formato: "YYYY-MM"
        
        public decimal ValorPago { get; set; }
        public string Status { get; set; } = "PAGO";
        
        public string? ComprovanteUrl { get; set; } // Onde vamos salvar o caminho do arquivo

        [JsonIgnore]
        public ContaFixa? ContaFixa { get; set; }
    }
}