import { useState } from 'react';
import { useFinancas } from './hooks/useFinancas';
import Dashboard from './components/Dashboard';
import SecaoCartoes from './components/SecaoCartoes';
import Auth from './components/Auth'; 
import Perfil from './components/Perfil'; 

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const salvo = localStorage.getItem('upfinancas_user');
    return salvo ? JSON.parse(salvo) : null;
  });

  const [abaAtiva, setAbaAtiva] = useState('cartoes');
  
  const [dataMaster, setDataMaster] = useState(new Date());
  
  const { 
    comprasCartao, comprasPorCartao, cartoes, 
    adicionarCartao, editarCartao, adicionarCompra, editarCompra, excluirCompra, excluirCartao,
    atualizarPerfil,
    carregarDados
  } = useFinancas();

  const handleLogout = () => {
    localStorage.removeItem('upfinancas_user');
    localStorage.removeItem('upfinancas_token'); 
    setUsuarioLogado(null);
    window.location.replace('/'); 
  };

  const alterarMes = (quantidade) => {
    setDataMaster(prev => {
      const novaData = new Date(prev);
      novaData.setMonth(prev.getMonth() + quantidade);
      return novaData;
    });
  };

  const escolherDataExata = (e) => {
    if (e.target.value) {
       const [ano, mes, dia] = e.target.value.split('-');
       setDataMaster(new Date(ano, mes - 1, dia));
    }
  };

  if (!usuarioLogado) {
    return <Auth onLogin={(user, token) => {
      localStorage.setItem('upfinancas_user', JSON.stringify(user));
      localStorage.setItem('upfinancas_token', token); 
      setUsuarioLogado(user);
    }} />;
  }

  const dataFormatadaInput = dataMaster.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      <style>{`
        .date-input-overlay::-webkit-calendar-picker-indicator {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }
      `}</style>

      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm">U</div>
            <span className="font-black text-slate-800 text-lg tracking-tight">UpFinanças</span>
          </div>
          
          <nav className="flex gap-2">
            <button onClick={() => setAbaAtiva('dashboard')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${abaAtiva === 'dashboard' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>Dashboard</button>
            <button onClick={() => setAbaAtiva('cartoes')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${abaAtiva === 'cartoes' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>Cartões</button>
            <button onClick={() => setAbaAtiva('gastos')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${abaAtiva === 'gastos' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>Gastos da Casa</button>
            <button onClick={() => setAbaAtiva('emprestimos')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${abaAtiva === 'emprestimos' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>Empréstimos</button>
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-2 py-1.5 rounded-xl font-black text-sm shadow-sm select-none">
              <button onClick={() => alterarMes(-1)} className="hover:text-indigo-900 hover:bg-indigo-100 transition-colors p-1.5 rounded-lg flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
              
              <div className="min-w-[140px] text-center flex justify-center items-center relative overflow-hidden h-8 rounded hover:bg-indigo-100 transition-colors cursor-pointer" title="Clique para escolher um dia específico">
                <input 
                  type="date" 
                  value={dataFormatadaInput} 
                  onChange={escolherDataExata} 
                  className="date-input-overlay absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />
                <span className="uppercase tracking-wider pointer-events-none relative z-0">
                  {dataMaster.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ de /g, ' ').replace('.', '')}
                </span>
              </div>

              <button onClick={() => alterarMes(1)} className="hover:text-indigo-900 hover:bg-indigo-100 transition-colors p-1.5 rounded-lg flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>

            <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
               
               {/* ÁREA DO NOME AGORA É CLICÁVEL E DIRECIIONA PARA O PERFIL */}
               <div 
                 onClick={() => setAbaAtiva('perfil')} 
                 className="flex flex-col items-end cursor-pointer hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                 title="Editar configurações da conta"
               >
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Logado como</span>
                  <span className="text-sm font-black text-indigo-600 leading-tight">{usuarioLogado.nome}</span>
               </div>
               
               <button onClick={handleLogout} className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-2 rounded-lg text-xs font-black transition-colors" title="Sair e fechar a sessão">
                 SAIR
               </button>
            </div>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {abaAtiva === 'dashboard' && <Dashboard comprasCartao={comprasCartao} cartoes={cartoes} dataFoco={dataMaster} />}
        {abaAtiva === 'cartoes' && (
          <SecaoCartoes 
            comprasPorCartao={comprasPorCartao} 
            cartoes={cartoes} 
            adicionarCartao={adicionarCartao} 
            editarCartao={editarCartao}
            adicionarCompra={adicionarCompra} 
            editarCompra={editarCompra} 
            excluirCompra={excluirCompra} 
            excluirCartao={excluirCartao} 
            dataFoco={dataMaster} 
            dataSimulada={dataFormatadaInput} 
          />
        )}
        {abaAtiva === 'gastos' && <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm"><p className="text-slate-400 font-bold text-lg">Módulo de Gastos da Casa</p></div>}
        {abaAtiva === 'emprestimos' && <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm"><p className="text-slate-400 font-bold text-lg">Módulo de Empréstimos</p></div>}
        {abaAtiva === 'perfil' && (
          <Perfil 
            usuarioLogado={usuarioLogado} 
            setUsuarioLogado={setUsuarioLogado} 
            atualizarPerfil={atualizarPerfil} 
          />
        )}
      </main>
    </div>
  );
}