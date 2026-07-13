namespace UpFinancas.Api.Models;

public class CartaoDeCredito
{
    public int Id { get; set; }
    public string NomeBanco { get; set; } = string.Empty;
    public string CorHexadecimal { get; set; } = string.Empty;

    public string NumeroFinal { get; set; } = string.Empty;

    public int DiaFechamento { get; set; }
    public int DiaPagamento { get; set; }

    public List<CompraCartao> Compras { get; set; } = new();
}