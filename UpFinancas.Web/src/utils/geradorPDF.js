import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const gerarExtratoCartaoPDF = (cartao, comprasDoCartao, mesAnoFoco) => {
  const doc = new jsPDF();

  // Cabeçalho do Extrato
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); 
  doc.text(`Extrato - ${cartao.nomeBanco || cartao.nome || 'Cartão'}`, 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Período de Referência: ${mesAnoFoco}`, 14, 30);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 35);

  const comprasAgrupadas = comprasDoCartao.reduce((acc, compra) => {
    const pessoa = compra.titular || compra.responsavel || compra.nome || 'Despesas Gerais';
    if (!acc[pessoa]) acc[pessoa] = [];
    acc[pessoa].push(compra);
    return acc;
  }, {});

  let startY = 45;

  Object.keys(comprasAgrupadas).forEach((pessoa) => {
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59); 
    doc.text(`Responsável: ${pessoa.toUpperCase()}`, 14, startY);
    
    const comprasPessoa = comprasAgrupadas[pessoa];
    let totalPessoa = 0;

    const linhasTabela = comprasPessoa.map(c => {
      // 1. Corrige o cálculo do valor (pega o valorTotal e divide pelas parcelas)
      const valorTotal = Number(c.valorTotal || c.valor || 0);
      const qtdParcelas = Number(c.quantidadeParcelas !== undefined ? c.quantidadeParcelas : (c.parcelas || 1));
      
      // Se for assinatura (0 parcelas), usa o valor cheio. Se não, divide.
      const valorNumerico = qtdParcelas > 0 ? valorTotal / qtdParcelas : valorTotal;
      totalPessoa += valorNumerico;
      
      // 2. Corrige a data (pega do campo dataCompra e formata para o padrão BR)
      const dataCorreta = c.dataCompra || c.data;
      let dataFormatada = '--/--/----';
      if (dataCorreta) {
          const partes = dataCorreta.split('T')[0].split('-'); // Separa Ano, Mês, Dia
          if (partes.length === 3) {
              dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
          }
      }

      return [
        dataFormatada,
        c.descricao || 'Sem descrição',
        `R$ ${valorNumerico.toFixed(2)}`
      ];
    });

    linhasTabela.push(['', 'TOTAL DESTA PESSOA:', `R$ ${totalPessoa.toFixed(2)}`]);

    autoTable(doc, {
      startY: startY + 5,
      head: [['Data', 'Descrição', 'Valor (Mês)']], // <-- VÍRGULA CORRIGIDA AQUI
      body: linhasTabela,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: { 
        0: { cellWidth: 30 }, 
        1: { cellWidth: 'auto' }, 
        2: { cellWidth: 40, halign: 'right' } 
      },
      didParseCell: function(data) {
        if (data.row.index === linhasTabela.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [238, 242, 255]; 
          data.cell.styles.textColor = [79, 70, 229];
        }
      }
    });

    startY = doc.lastAutoTable.finalY + 15;
    if (startY > 270) {
      doc.addPage();
      startY = 20;
    }
  });

  // Ajusta o nome do arquivo para usar o nome do Banco e o Mês
  doc.save(`Extrato_${cartao.nomeBanco || 'Fatura'}_${mesAnoFoco.replace(' ', '_')}.pdf`);
};