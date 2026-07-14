import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ comprasCartao, cartoes, dataFoco }) {
  
  // =========================================================
  // FUNÇÃO DE INTELIGÊNCIA TEMPORAL CORRIGIDA (IGUAL AOS CARTÕES)
  // =========================================================
  const obterInfoParcela = (compra, dataAlvo) => {
    if (!compra.dataCompra) return { ativa: false };
    const dtCompra = new Date(compra.dataCompra);
    const diferencaMeses = (dataAlvo.getFullYear() - dtCompra.getFullYear()) * 12 + (dataAlvo.getMonth() - dtCompra.getMonth());
    const totalParc = compra.quantidadeParcelas !== undefined ? compra.quantidadeParcelas : (compra.parcelas || 1);

    if (totalParc === 0) return { ativa: diferencaMeses >= 0, totalParc: 1 };
    
    const pAtualCalculada = (compra.parcelaAtual != null ? compra.parcelaAtual : 1) + diferencaMeses;

    if (pAtualCalculada >= 1 && pAtualCalculada <= totalParc) {
      return { ativa: true, totalParc };
    }
    return { ativa: false };
  };

  // 1. LÓGICA DO GRÁFICO DE BARRAS (FATURA POR CARTÃO)
  const dadosFaturaCartao = useMemo(() => {
    const agrupado = {};
    cartoes.forEach(c => {
      const rotuloExibicao = c.numeroFinal ? `Final ${c.numeroFinal}` : c.nomeBanco;
      agrupado[c.id] = { nome: rotuloExibicao, total: 0, cor: c.corHexadecimal };
    });

    comprasCartao.forEach(compra => {
      const info = obterInfoParcela(compra, dataFoco);
      if (info.ativa && !compra.foiPago && compra.cartaoDeCreditoId) {
        const idCartao = compra.cartaoDeCreditoId;
        const valorParcela = (compra.valorTotal || compra.valor) / info.totalParc;
        if (agrupado[idCartao]) agrupado[idCartao].total += valorParcela;
      }
    });

    return Object.values(agrupado).filter(d => d.total > 0);
  }, [comprasCartao, cartoes, dataFoco]);

  // 2. LÓGICA DO GRÁFICO DE PIZZA (DISTRIBUIÇÃO POR CATEGORIA)
  const dadosCategorias = useMemo(() => {
    const somaCategorias = comprasCartao.reduce((acc, compra) => {
      const info = obterInfoParcela(compra, dataFoco);
      if (!info.ativa || compra.foiPago) return acc; 

      const categoria = compra.categoria || 'Outros';
      const valorParcela = (compra.valorTotal || compra.valor) / info.totalParc;
      acc[categoria] = (acc[categoria] || 0) + valorParcela;
      return acc;
    }, {});

    const coresBase = ['#8A05BE', '#F43F5E', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#64748B'];
    
    return Object.entries(somaCategorias)
      .map(([nome, valor], index) => ({
        name: nome,
        value: valor,
        color: coresBase[index % coresBase.length]
      }))
      .sort((a, b) => b.value - a.value); 
  }, [comprasCartao, dataFoco]);

  // =========================================================
  // NOVO: LÓGICA DO TOP DEVEDORES (SOMANDO TODOS OS CARTÕES)
  // =========================================================
  const rankingDevedores = useMemo(() => {
    const agrupadoDevedores = {};

    comprasCartao.forEach(compra => {
      const info = obterInfoParcela(compra, dataFoco);
      // Só soma se a compra pertencer ao mês e se ainda não foi paga
      if (info.ativa && !compra.foiPago) {
        let nomeFormatado = compra.titular ? compra.titular.trim().toLowerCase() : 'desconhecido';
        nomeFormatado = nomeFormatado.charAt(0).toUpperCase() + nomeFormatado.slice(1);

        const valorParcela = (compra.valorTotal || compra.valor) / info.totalParc;
        agrupadoDevedores[nomeFormatado] = (agrupadoDevedores[nomeFormatado] || 0) + valorParcela;
      }
    });

    // Converte o objeto para um Array e ordena do maior valor para o menor
    return Object.entries(agrupadoDevedores)
      .map(([nome, valor]) => ({ nome, valor }))
      .sort((a, b) => b.valor - a.valor);
  }, [comprasCartao, dataFoco]);

  // Valor máximo do devedor número 1 (usado para basear a largura percentual da barra)
  const maiorDividaDoMes = rankingDevedores[0]?.valor || 1;

  const totalCartoes = dadosFaturaCartao.reduce((acc, c) => acc + c.total, 0);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800">Dashboard</h2>
        <p className="text-slate-500 font-medium">Visão Geral das Faturas Atuais</p>
      </div>

      {/* CARDS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 font-semibold text-sm">Total em Cartões</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">💳</div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-indigo-700">R$ {totalCartoes.toFixed(2)}</h3>
            <span className="text-slate-400 text-xs font-medium">{cartoes.length} cartão(ões)</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm opacity-50"><div className="flex justify-between mb-4"><span className="text-slate-500 font-semibold text-sm">Gastos Pendentes</span><div className="p-2 bg-rose-50 text-rose-600 rounded-lg">🏠</div></div><h3 className="text-3xl font-black text-rose-600">R$ 0.00</h3></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm opacity-50"><div className="flex justify-between mb-4"><span className="text-slate-500 font-semibold text-sm">Empréstimos</span><div className="p-2 bg-purple-50 text-purple-600 rounded-lg">🏦</div></div><h3 className="text-3xl font-black text-purple-600">R$ 0.00</h3></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><div className="flex justify-between mb-4"><span className="text-slate-500 font-semibold text-sm">Total Geral Previsto</span><div className="p-2 bg-slate-100 text-slate-600 rounded-lg">📈</div></div><h3 className="text-3xl font-black text-slate-800">R$ {totalCartoes.toFixed(2)}</h3></div>
      </div>

      {/* ÁREA DOS DOIS GRÁFICOS ORIGINAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-1">Distribuição do Débito (Cartões)</h3>
          <p className="text-sm text-slate-500 mb-6">Proporção por categoria do que ainda falta pagar</p>
          {dadosCategorias.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 font-medium">Nenhum débito pendente.</div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dadosCategorias} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                      {dadosCategorias.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />)}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 space-y-3 pl-4">
                {dadosCategorias.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-slate-600 font-semibold truncate max-w-[120px]">{item.name}</span>
                    </div>
                    <span className="font-black text-slate-800">R$ {item.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-1">Fatura por Cartão</h3>
          <p className="text-sm text-slate-500 mb-6">Valor pendente da parcela deste mês</p>
          {dadosFaturaCartao.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 font-medium">Nenhuma fatura em aberto.</div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosFaturaCartao} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="nome" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} tickFormatter={(val) => `R$${val}`} />
                  <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '12px', border: 'none' }} formatter={(value) => `R$ ${value.toFixed(2)}`} />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    {dadosFaturaCartao.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.cor} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* NOVO PAINEL: RANKING DE QUEM DEVE MAIS (TODOS OS CARTÕES) */}
      {/* ========================================================= */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800">🏆 Ranking de Gastos por Titular</h3>
          <p className="text-sm text-slate-500">Soma acumulada de todas as faturas ativas deste mês</p>
        </div>

        {rankingDevedores.length === 0 ? (
          <div className="py-8 text-center text-slate-400 font-medium italic">
            Nenhum devedor identificado para este período.
          </div>
        ) : (
          <div className="space-y-4 mt-6">
            {rankingDevedores.map((devedor, index) => {
              // Calcula a porcentagem que a dívida dele representa comparada ao devedor número 1
              const percentualBarra = (devedor.valor / maiorDividaDoMes) * 100;
              
              // Cores especiais para destacar o Top 1, 2 e 3
              const medalhas = ["🥇", "🥈", "🥉"];
              const coresBarras = ["bg-rose-500", "bg-indigo-600", "bg-amber-500"];
              const corBarraAtual = coresBarras[index] || "bg-slate-400";

              return (
                <div key={devedor.nome} className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-50 pb-3 last:border-none">
                  
                  {/* Nome e Medalha */}
                  <div className="w-full md:w-1/4 flex items-center gap-2">
                    <span className="text-base">{medalhas[index] || "👤"}</span>
                    <span className="font-bold text-slate-700 text-sm">{devedor.nome}</span>
                    {index === 0 && (
                      <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
                        Top 1
                      </span>
                    )}
                  </div>

                  {/* Barra Progressiva Estilizada */}
                  <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full ${corBarraAtual} rounded-full transition-all duration-500`}
                      style={{ width: `${percentualBarra}%` }}
                    />
                  </div>

                  {/* Valor Total Devido */}
                  <div className="w-full md:w-1/4 text-left md:text-right pl-0 md:pl-4">
                    <span className="font-black text-slate-800 text-sm">
                      R$ {devedor.valor.toFixed(2)}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}