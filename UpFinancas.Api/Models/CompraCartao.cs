using System.Text.Json.Serialization;

namespace UpFinancas.Api.Models
{
    public class CompraCartao
    {
        public int Id { get; set; }
        public string Titular { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public decimal ValorTotal { get; set; }
        public int ParcelaAtual { get; set; } = 1;
        public int QuantidadeParcelas { get; set; }
        public DateTime DataCompra { get; set; }
        public bool FoiPago { get; set; } = false;
        public string Categoria { get; set; } = "Outros";
        
        public int CartaoDeCreditoId { get; set; }
        
        [JsonIgnore]
        public CartaoDeCredito? CartaoDeCredito { get; set; }
    }
}