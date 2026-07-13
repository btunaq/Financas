namespace UpFinancas.Api.Models;

public class CompraCartao
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal ValorTotal { get; set; }
    public int QuantidadeParcelas { get; set; }
    public DateTime DataCompra { get; set; }
    public string Titular { get; set; } = string.Empty; 
    public int ParcelaAtual { get; set; }
    public int CartaoDeCreditoId { get; set; }  
    public bool FoiPago { get; set; } = false;
    public CartaoDeCredito? CartaoDeCredito { get; set; }
}