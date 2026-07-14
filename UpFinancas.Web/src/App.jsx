import { useState } from 'react';
import { useFinancas } from './hooks/useFinancas';
import Dashboard from './components/Dashboard';
import SecaoCartoes from './components/SecaoCartoes';

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('dashboard');
  
  // ESTADO DA DATA ATIVA (Começa no mês atual do sistema)
  const [dataFoco, setDataFoco] = useState(new Date());
  
  const { 
    comprasCartao, 
    comprasPorCartao, 
    cartoes, 
    adicionarCartao, 
    adicionarCompra, 
    editarCompra, 
    excluirCompra, 
    excluirCartao 
  } = useFinancas();

  // AQUI ESTAVA O ERRO! Corrigido de "quantity" para "quantidade"
  const alterarMes = (quantidade) => {
    setDataFoco(prev => new Date(prev.getFullYear(), prev.getMonth() + quantidade, 1));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm">U</div>
            <span className="font-black text-slate-800 text-lg tracking-tight">UpFinanças</span>
          </div>
          
          <nav className="flex gap-2">
            <button 
              onClick={() => setAbaAtiva('dashboard')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                abaAtiva === 'dashboard' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              📊 Dashboard
            </button>
            <button 
              onClick={() => setAbaAtiva('cartoes')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                abaAtiva === 'cartoes' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              💳 Cartões
            </button>
            <button 
              onClick={() => setAbaAtiva('gastos')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                abaAtiva === 'gastos' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              🏠 Gastos da Casa
            </button>
            <button 
              onClick={() => setAbaAtiva('emprestimos')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                abaAtiva === 'emprestimos' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              🏛️ Empréstimos
            </button>
          </nav>
          
          {/* CONTROLE SELETOR DE MÊS COM AS SETAS */}
          <div className="flex items-center gap-3 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-black text-sm shadow-sm select-none">
            <button onClick={() => alterarMes(-1)} className="hover:text-indigo-900 transition-colors px-1 text-base">◀</button>
            <span className="uppercase tracking-wider min-w-[110px] text-center">
              {dataFoco.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => alterarMes(1)} className="hover:text-indigo-900 transition-colors px-1 text-base">▶</button>
          </div>

        </div>
      </header>

      {/* CONTEÚDO DINÂMICO PASSANDO A DATA SELECIONADA */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {abaAtiva === 'dashboard' && (
          <Dashboard comprasCartao={comprasCartao} cartoes={cartoes} dataFoco={dataFoco} />
        )}

        {abaAtiva === 'cartoes' && (
          <SecaoCartoes 
            comprasPorCartao={comprasPorCartao} 
            cartoes={cartoes} 
            adicionarCartao={adicionarCartao} 
            adicionarCompra={adicionarCompra} 
            editarCompra={editarCompra} 
            excluirCompra={excluirCompra} 
            excluirCartao={excluirCartao} 
            dataFoco={dataFoco}
          />
        )}

        {abaAtiva === 'gastos' && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-bold text-lg">Módulo de Gastos da Casa</p>
          </div>
        )}

        {abaAtiva === 'emprestimos' && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-bold text-lg">Módulo de Empréstimos</p>
          </div>
        )}
        
      </main>
    </div>
  );
}