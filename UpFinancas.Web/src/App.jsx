import { useState } from 'react';
import { useFinancas } from './hooks/useFinancas.js';
import SecaoCartoes from './components/SecaoCartoes.jsx';
import SecaoGastos from './components/SecaoGastos.jsx';
import SecaoEmprestimos from './components/SecaoEmprestimos.jsx';

export default function App() {
  const [seccaoAtiva, setSeccaoAtiva] = useState(0);
  const seccoes = ['Cartões de Crédito', 'Gastos da Casa', 'Empréstimos'];

  const { comprasPorCartao, cartoes, gastosFixos, emprestimos, adicionarCartao, adicionarCompra, editarCompra, excluirCompra, excluirCartao } = useFinancas();

  const proximaSeccao = () => setSeccaoAtiva((prev) => (prev + 1) % 3);
  const seccaoAnterior = () => setSeccaoAtiva((prev) => (prev - 1 + 3) % 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 relative">
        <h1 className="text-2xl font-black text-indigo-600 tracking-tight w-1/3">UpFinanças</h1>
        <div className="flex items-center justify-center space-x-4 bg-slate-100 rounded-xl p-2 absolute left-1/2 -translate-x-1/2 shadow-inner border border-slate-200">
          <button className="px-4 py-2 hover:bg-white hover:shadow rounded-lg transition-all text-xl font-black text-slate-400 hover:text-indigo-600">&lt;</button>
          <span className="text-xl font-bold text-slate-800 min-w-[160px] text-center tracking-wide uppercase">Julho 2026</span>
          <button className="px-4 py-2 hover:bg-white hover:shadow rounded-lg transition-all text-xl font-black text-slate-400 hover:text-indigo-600">&gt;</button>
        </div>
        <div className="w-1/3 flex justify-end"></div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 mt-4">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <button onClick={seccaoAnterior} className="px-5 py-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition-colors">
            &larr; Anterior
          </button>
          <h2 className="text-2xl font-black text-slate-800">{seccoes[seccaoAtiva]}</h2>
          <button onClick={proximaSeccao} className="px-5 py-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition-colors">
            Próxima &rarr;
          </button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 min-h-[500px]">
          {seccaoAtiva === 0 && (
            <SecaoCartoes 
              comprasPorCartao={comprasPorCartao} 
              cartoes={cartoes} 
              adicionarCartao={adicionarCartao}
              adicionarCompra={adicionarCompra}
              editarCompra={editarCompra}
              excluirCompra={excluirCompra} 
              excluirCartao={excluirCartao}
            />
          )}
          {seccaoAtiva === 1 && <SecaoGastos gastosFixos={gastosFixos} />}
          {seccaoAtiva === 2 && <SecaoEmprestimos emprestimos={emprestimos} />}
        </div>
      </main>
    </div>
  );
}