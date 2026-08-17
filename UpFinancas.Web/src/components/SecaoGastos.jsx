import { useState } from 'react';

// Ícones SVG
const IconLightning = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
const IconDrop = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c-2.678 0-5.187-1.127-6.904-3.056C3.393 16.78 2.25 14.3 2.25 11.25 2.25 5.5 12 2.25 12 2.25s9.75 3.25 9.75 9c0 3.05-.143 5.53-2.846 7.444C17.187 20.623 14.678 21.75 12 21.75z" /></svg>;
const IconWifi = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg>;
const IconChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const IconChevronUp = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;

// Dados iniciais simulados (No futuro, isto virá do banco de dados/API)
const gastosIniciais = [
  {
    id: 'energia',
    titulo: 'Energia Elétrica',
    icone: 'energia',
    corIcone: 'text-amber-500',
    corFundo: 'bg-amber-50',
    historico: [
      { id: 1, mesAno: '2026-07', valor: 152.00, status: 'PAGO' },
      { id: 2, mesAno: '2026-06', valor: 148.50, status: 'PAGO' },
      { id: 3, mesAno: '2026-05', valor: 155.20, status: 'PAGO' },
      { id: 4, mesAno: '2026-04', valor: 140.00, status: 'PAGO' },
      { id: 11, mesAno: '2026-03', valor: 135.00, status: 'PAGO' },
      { id: 12, mesAno: '2026-02', valor: 160.00, status: 'PAGO' },
    ]
  },
  {
    id: 'agua',
    titulo: 'Água e Esgoto',
    icone: 'agua',
    corIcone: 'text-blue-500',
    corFundo: 'bg-blue-50',
    historico: [
      { id: 5, mesAno: '2026-07', valor: 65.00, status: 'PAGO' },
      { id: 6, mesAno: '2026-06', valor: 65.00, status: 'PAGO' },
      { id: 7, mesAno: '2026-05', valor: 68.20, status: 'PAGO' },
    ]
  },
  {
    id: 'internet',
    titulo: 'Internet / TV',
    icone: 'internet',
    corIcone: 'text-emerald-500',
    corFundo: 'bg-emerald-50',
    historico: [
      { id: 8, mesAno: '2026-07', valor: 99.90, status: 'PAGO' },
      { id: 9, mesAno: '2026-06', valor: 99.90, status: 'PAGO' },
      { id: 10, mesAno: '2026-05', valor: 99.90, status: 'PAGO' },
    ]
  }
];

export default function SecaoGastos({ dataFoco = new Date() }) {
  const [gastos, setGastos] = useState(gastosIniciais);
  const [cardsExpandidos, setCardsExpandidos] = useState({});

  // Gera a chave YYYY-MM para buscar a fatura do mês atual no calendário
  const mesFocoStr = `${dataFoco.getFullYear()}-${String(dataFoco.getMonth() + 1).padStart(2, '0')}`;
  const mesNomes = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

  const toggleExpandir = (id) => {
    setCardsExpandidos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderIcon = (tipo) => {
    if (tipo === 'energia') return <IconLightning />;
    if (tipo === 'agua') return <IconDrop />;
    if (tipo === 'internet') return <IconWifi />;
    return <IconLightning />;
  };

  return (
    <div className="animate-fade-in">
      {/* Classe para esconder a barra de scroll nativa mantendo a funcionalidade */}
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-semibold text-slate-500">Gestão de Contas da Casa</h3>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-all">
          + Nova Conta Fixa
        </button>
      </div>

      {/* GRID: Adapta-se ao ecrã e empurra os cards automaticamente quando expandidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        
        {gastos.map(gasto => {
          const isExpandido = cardsExpandidos[gasto.id];
          
          // Procura se já existe um valor guardado para o mês selecionado no topo
          const faturaAtual = gasto.historico.find(h => h.mesAno === mesFocoStr);
          
          // MÁGICA DA ESTIMATIVA: Se não houver fatura atual, calcula a média dos últimos 3 meses
          let valorMostrar = 0;
          let isEstimativa = false;

          if (faturaAtual) {
            valorMostrar = faturaAtual.valor;
          } else if (gasto.historico.length > 0) {
            // Pega as 3 faturas mais recentes
            const ultimos3 = gasto.historico.slice(0, 3);
            const soma = ultimos3.reduce((acc, curr) => acc + curr.valor, 0);
            valorMostrar = soma / ultimos3.length;
            isEstimativa = true;
          }

          return (
            <div key={gasto.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
              
              {/* CABEÇALHO DO CARD */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gasto.corFundo} ${gasto.corIcone}`}>
                      {renderIcon(gasto.icone)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-lg">{gasto.titulo}</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {mesNomes[dataFoco.getMonth()]} {dataFoco.getFullYear()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Botão de Expandir/Recolher Acordeão */}
                  <button 
                    onClick={() => toggleExpandir(gasto.id)} 
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                    title={isExpandido ? "Recolher Histórico" : "Ver Histórico"}
                  >
                    {isExpandido ? <IconChevronUp /> : <IconChevronDown />}
                  </button>
                </div>

                <div className="mt-4">
                  {/* Etiqueta de Estimativa (Só aparece se o mês não tiver fatura lançada) */}
                  {isEstimativa && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider mb-1 inline-block">
                      Valor Estimado
                    </span>
                  )}
                  
                  <div className="flex justify-between items-end">
                    <h2 className={`text-3xl font-black tracking-tight ${isEstimativa ? 'text-slate-400' : 'text-slate-800'}`}>
                      R$ {valorMostrar.toFixed(2)}
                    </h2>
                    
                    {/* Botões de Ação */}
                    {isEstimativa ? (
                      <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors pb-1">
                        Editar Valor Real
                      </button>
                    ) : (
                      faturaAtual?.status === 'PAGO' ? (
                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold pb-1">
                          <IconCheck /> PAGO
                        </div>
                      ) : (
                        <button className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-700 shadow-sm">
                          MARCAR PAGO
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* ÁREA EXPANDIDA - HISTÓRICO */}
              {isExpandido && (
                <div className="border-t border-slate-100 bg-slate-50">
                  <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Histórico do Ano</span>
                    <span className="text-[10px] text-slate-400 font-medium">Scroll para ver mais</span>
                  </div>
                  
                  {/* LIMITE DE ALTURA: Mostra ~3 itens (180px) e rola o resto com hide-scroll invisível */}
                  <div className="max-h-[180px] overflow-y-auto hide-scroll p-2">
                    {gasto.historico.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 font-medium py-4">Sem histórico anterior.</p>
                    ) : (
                      <ul className="space-y-1">
                        {gasto.historico.map((fat) => {
                          const [anoFat, mesFat] = fat.mesAno.split('-');
                          const nomeMesFat = mesNomes[parseInt(mesFat) - 1];

                          return (
                            <li key={fat.id} className="flex justify-between items-center p-3 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm">
                              <span className="text-sm font-bold text-slate-600 uppercase">
                                {nomeMesFat} <span className="text-slate-400">{anoFat}</span>
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-slate-700">R$ {fat.valor.toFixed(2)}</span>
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${fat.status === 'PAGO' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                  {fat.status}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}