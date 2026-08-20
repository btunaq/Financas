import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8080'; 

// --- ÍCONES ---
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const IconPencil = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.112l-2.051.683a.75.75 0 01-.955-.955l.683-2.051a4.5 4.5 0 011.112-1.89l13.438-13.438zM16.862 4.487L19.5 7.125" /></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const IconChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const IconChevronUp = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>;
const IconEye = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const IconX = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

const MapIcones = {
  energia: { icone: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" /></svg>, corBg: 'bg-amber-50', corText: 'text-amber-500' },
  agua: { icone: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" /></svg>, corBg: 'bg-blue-50', corText: 'text-blue-500' },
  internet: { icone: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg>, corBg: 'bg-emerald-50', corText: 'text-emerald-500' },
  casa: { icone: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>, corBg: 'bg-slate-100', corText: 'text-slate-600' }
};

const mesNomes = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

function ContaCard({ conta, dataFoco, isExpanded, onToggle, onEditConta, onExcluirConta, onAbrirPagamento, onExcluirPagamento, onViewComprovante }) {
  const [contaEmExclusao, setContaEmExclusao] = useState(false);
  const [pagamentoEmExclusao, setPagamentoEmExclusao] = useState(null);

  const infoEstilo = MapIcones[conta.tipoIcone] || MapIcones.casa;
  const chaveMesAtual = `${dataFoco.getFullYear()}-${String(dataFoco.getMonth() + 1).padStart(2, '0')}`;
  const mesAtualNome = `${mesNomes[dataFoco.getMonth()]} ${dataFoco.getFullYear()}`;

  const pagamentoAtual = conta.historico?.find(h => h.mesAno === chaveMesAtual);
  const historicoOrdenado = conta.historico ? [...conta.historico].sort((a, b) => new Date(b.mesAno + '-01') - new Date(a.mesAno + '-01')) : [];

  // Reseta os menus de exclusão se o card for fechado
  useEffect(() => {
    if (!isExpanded) {
      setContaEmExclusao(false);
      setPagamentoEmExclusao(null);
    }
  }, [isExpanded]);

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 p-6 flex flex-col transition-all">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${infoEstilo.corBg} ${infoEstilo.corText}`}>
            {infoEstilo.icone}
          </div>
          <div>
            <h4 className="font-black text-slate-800 text-lg leading-tight">{conta.nome}</h4>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{mesAtualNome}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button onClick={() => onEditConta(conta)} className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors" title="Configurar Conta"><IconSettings /></button>
          <button onClick={onToggle} className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
            {isExpanded ? <IconChevronUp /> : <IconChevronDown />}
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start">
        {pagamentoAtual ? (
          <span className="border border-emerald-200 text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
            {pagamentoAtual.status}
          </span>
        ) : (
          <span className="border border-amber-200 text-amber-500 bg-amber-50 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
            VALOR ESTIMADO
          </span>
        )}
        
        <div className="flex justify-between items-end w-full mt-1">
          <h2 className={`text-4xl font-black tracking-tight ${pagamentoAtual ? 'text-emerald-600' : 'text-slate-400'}`}>
            <span className="text-2xl mr-1 opacity-60">R$</span>
            {pagamentoAtual ? pagamentoAtual.valorPago.toFixed(2) : conta.valorEstimado.toFixed(2)}
          </h2>
          <button 
            onClick={() => onAbrirPagamento(conta.id, pagamentoAtual, chaveMesAtual)} 
            className="text-indigo-600 text-xs font-bold hover:underline mb-1"
          >
            {pagamentoAtual ? 'Editar Valor/Comprovante' : 'Editar Valor Real'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 pt-4 border-t border-slate-100 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Histórico do Ano</span>
            <button 
              onClick={() => onAbrirPagamento(conta.id, null, '')} 
              className="text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition-colors flex items-center gap-1"
            >
              <IconPlus /> Lançar Mês Antigo
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto pr-2 space-y-3 hide-scroll">
            {historicoOrdenado.length === 0 ? (
              <p className="text-center text-xs text-slate-400 italic py-4">Nenhum histórico registrado.</p>
            ) : (
              historicoOrdenado.map((hist) => {
                const [ano, mes] = hist.mesAno.split('-');
                const nomeMesHist = `${mesNomes[parseInt(mes) - 1]} ${ano}`;
                const comprovanteCompleto = hist.comprovanteUrl ? `${API_URL}${hist.comprovanteUrl}` : null;

                return (
                  <div key={hist.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 group">
                    <span className="text-xs font-bold text-slate-600">{nomeMesHist}</span>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-800">R$ {hist.valorPago.toFixed(2)}</span>
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-black uppercase">
                        {hist.status}
                      </span>
                      
                      {pagamentoEmExclusao === hist.id ? (
                        <div className="flex items-center gap-1 animate-fade-in ml-2">
                          <span className="text-[9px] font-black text-rose-600 uppercase mr-1">Excluir?</span>
                          <button onClick={() => onExcluirPagamento(conta.id, hist.id)} className="bg-rose-600 text-white p-1 rounded hover:bg-rose-700 transition-colors shadow-sm"><IconCheck /></button>
                          <button onClick={() => setPagamentoEmExclusao(null)} className="bg-slate-200 text-slate-600 p-1 rounded hover:bg-slate-300 transition-colors shadow-sm"><IconX /></button>
                        </div>
                      ) : (
                        <div className="hidden group-hover:flex items-center gap-1 ml-2">
                          {comprovanteCompleto && (
                            <button onClick={() => onViewComprovante(comprovanteCompleto)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-1.5 rounded" title="Ver Comprovante"><IconEye /></button>
                          )}
                          <button onClick={() => onAbrirPagamento(conta.id, hist, hist.mesAno)} className="text-indigo-500 hover:text-indigo-700 bg-indigo-50 p-1.5 rounded" title="Editar"><IconPencil /></button>
                          <button onClick={() => setPagamentoEmExclusao(hist.id)} className="text-rose-500 hover:text-rose-700 bg-rose-50 p-1.5 rounded" title="Excluir"><IconTrash /></button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center h-8 items-center">
            {contaEmExclusao ? (
               <div className="flex items-center gap-2 animate-fade-in bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                  <span className="text-[10px] font-black text-rose-600 uppercase">Apagar conta toda?</span>
                  <button onClick={() => onExcluirConta(conta.id)} className="bg-rose-600 text-white p-1 rounded hover:bg-rose-700 transition-colors shadow-sm"><IconCheck /></button>
                  <button onClick={() => setContaEmExclusao(false)} className="bg-slate-200 text-slate-600 p-1 rounded hover:bg-slate-300 transition-colors shadow-sm"><IconX /></button>
               </div>
            ) : (
               <button onClick={() => setContaEmExclusao(true)} className="text-[10px] text-rose-500 font-bold hover:underline">
                 Excluir Conta Permanentemente
               </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SecaoGastos({ dataFoco }) {
  const [contasFixas, setContasFixas] = useState([]);
  const [vista, setVista] = useState('lista'); 
  
  // Controla a "sanfona" para abrir um card de cada vez
  const [contaExpandidaId, setContaExpandidaId] = useState(null);

  const [comprovanteAtivo, setComprovanteAtivo] = useState(null);
  const [contaIdEdicao, setContaIdEdicao] = useState(null);
  const [nomeConta, setNomeConta] = useState('');
  const [valorEstimado, setValorEstimado] = useState('');
  const [tipoIcone, setTipoIcone] = useState('casa');

  const [pagamentoIdEdicao, setPagamentoIdEdicao] = useState(null);
  const [contaAlvoId, setContaAlvoId] = useState(null);
  const [mesAnoReferencia, setMesAnoReferencia] = useState('');
  const [valorPago, setValorPago] = useState('');
  const [arquivoComprovante, setArquivoComprovante] = useState(null);

  const getToken = () => localStorage.getItem('upfinancas_token');

  const carregarContas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/ContasFixas`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContasFixas(data);
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
    }
  };

  useEffect(() => {
    carregarContas();
  }, []);

  const abrirFormConta = (conta = null) => {
    if (conta) {
      setContaIdEdicao(conta.id);
      setNomeConta(conta.nome);
      setValorEstimado(conta.valorEstimado);
      setTipoIcone(conta.tipoIcone);
    } else {
      setContaIdEdicao(null);
      setNomeConta('');
      setValorEstimado('');
      setTipoIcone('casa');
    }
    setVista('form_conta');
  };

  const salvarConta = async (e) => {
    e.preventDefault();
    const dados = {
      nome: nomeConta,
      valorEstimado: parseFloat(valorEstimado),
      tipoIcone: tipoIcone
    };

    try {
      if (contaIdEdicao) {
        dados.id = contaIdEdicao;
        await fetch(`${API_URL}/api/ContasFixas/${contaIdEdicao}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
          body: JSON.stringify(dados)
        });
      } else {
        await fetch(`${API_URL}/api/ContasFixas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
          body: JSON.stringify(dados)
        });
      }
      
      await carregarContas();
      setVista('lista');
    } catch (error) {
      alert('Erro ao salvar a conta.');
    }
  };

  const excluirConta = async (id) => {
    try {
      await fetch(`${API_URL}/api/ContasFixas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      await carregarContas();
    } catch (error) {
      alert('Erro ao excluir conta.');
    }
  };

  const abrirFormPagamento = (idConta, pagamento = null, chaveMes = '') => {
    setContaAlvoId(idConta);
    if (pagamento) {
      setPagamentoIdEdicao(pagamento.id);
      setMesAnoReferencia(pagamento.mesAno);
      setValorPago(pagamento.valorPago);
      setArquivoComprovante(null); 
    } else {
      setPagamentoIdEdicao(null);
      setMesAnoReferencia(chaveMes); 
      const conta = contasFixas.find(c => c.id === idConta);
      setValorPago(conta?.valorEstimado || '');
      setArquivoComprovante(null);
    }
    setVista('form_pagamento');
  };

  const salvarPagamento = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('mesAno', mesAnoReferencia);
    formData.append('valorPago', valorPago);
    if (arquivoComprovante) {
      formData.append('comprovante', arquivoComprovante);
    }

    try {
      await fetch(`${API_URL}/api/ContasFixas/${contaAlvoId}/historico`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` }, 
        body: formData
      });
      
      await carregarContas();
      setVista('lista');
    } catch (error) {
      alert('Erro ao lançar histórico de pagamento.');
    }
  };

  const excluirPagamento = async (idConta, idPagamento) => {
    try {
      await fetch(`${API_URL}/api/ContasFixas/${idConta}/historico/${idPagamento}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      await carregarContas();
    } catch (error) {
        alert('Erro ao excluir histórico.');
    }
  };

  // --- RENDERS DAS TELAS ---

  // NOVO PDF EMBARCADO DIRETO NO SITE (Abaixo da Navbar)
  if (vista === 'view_comprovante') {
    return (
      <div className="animate-fade-in flex flex-col h-[80vh] min-h-[600px] bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white shrink-0">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <IconEye /> Visualizar Comprovante
          </h3>
          <button 
            onClick={() => setVista('lista')} 
            className="text-slate-500 hover:text-indigo-600 font-bold transition-colors px-5 py-2.5 bg-slate-50 hover:bg-indigo-50 rounded-xl"
          >
            ✕ Voltar
          </button>
        </div>
        <div className="flex-1 w-full bg-slate-100">
          <iframe 
            src={comprovanteAtivo} 
            className="w-full h-full border-0" 
            title="Comprovante de Pagamento"
          />
        </div>
      </div>
    );
  }

  if (vista === 'form_conta') {
    return (
      <div className="animate-fade-in max-w-xl mx-auto bg-white p-8 rounded-[24px] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
          <h3 className="text-2xl font-black text-slate-800">{contaIdEdicao ? 'Editar Conta Fixa' : 'Nova Conta Fixa'}</h3>
          <button onClick={() => setVista('lista')} className="text-slate-400 hover:text-rose-600 font-bold transition-colors">✕ Cancelar</button>
        </div>
        
        <form onSubmit={salvarConta} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Nome da Conta</label>
            <input required value={nomeConta} onChange={e => setNomeConta(e.target.value)} placeholder="Ex: Energia Elétrica, Água..." className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Valor Estimado (R$)</label>
            <p className="text-[10px] text-slate-400 mb-2 leading-tight">Esse valor aparecerá quando a conta ainda não tiver sido paga no mês.</p>
            <input type="number" step="0.01" required value={valorEstimado} onChange={e => setValorEstimado(e.target.value)} placeholder="150.00" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Ícone e Cor</label>
            <div className="flex gap-4">
              {Object.keys(MapIcones).map(key => (
                <button 
                  key={key} type="button" onClick={() => setTipoIcone(key)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border-2 ${tipoIcone === key ? 'border-indigo-500 shadow-md scale-110' : 'border-transparent hover:scale-105'} ${MapIcones[key].corBg} ${MapIcones[key].corText}`}
                >
                  {MapIcones[key].icone}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all mt-6 text-lg">
            {contaIdEdicao ? 'Salvar Alterações' : 'Criar Conta Fixa'}
          </button>
        </form>
      </div>
    );
  }

  if (vista === 'form_pagamento') {
    return (
      <div className="animate-fade-in max-w-xl mx-auto bg-white p-8 rounded-[24px] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
          <div>
             <h3 className="text-2xl font-black text-slate-800">Registrar Pagamento</h3>
             <p className="text-sm text-slate-400 font-bold mt-1">Lançar valor real do mês</p>
          </div>
          <button onClick={() => setVista('lista')} className="text-slate-400 hover:text-rose-600 font-bold transition-colors">✕ Cancelar</button>
        </div>
        
        <form onSubmit={salvarPagamento} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Mês de Referência</label>
              <input type="month" required value={mesAnoReferencia} onChange={e => setMesAnoReferencia(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600 font-bold uppercase tracking-wider" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Valor Real Pago (R$)</label>
              <input type="number" step="0.01" required value={valorPago} onChange={e => setValorPago(e.target.value)} placeholder="0.00" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-black text-emerald-600" />
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 border-dashed">
             <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
               <IconEye /> Anexar Comprovante (Opcional)
             </label>
             <p className="text-[10px] text-slate-400 mb-3">Selecione o PDF ou imagem do comprovante de pagamento para salvar no histórico.</p>
             
             <input 
                type="file" 
                accept="image/*,application/pdf" 
                onChange={e => setArquivoComprovante(e.target.files[0])} 
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" 
             />
          </div>

          <button type="submit" className="w-full bg-emerald-500 text-white font-black py-4 rounded-xl hover:bg-emerald-600 shadow-md shadow-emerald-200 transition-all mt-6 text-lg">
            Confirmar Pagamento
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-slate-600">Gestão de Contas da Casa</h2>
        <button onClick={() => abrirFormConta()} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center gap-2">
          <IconPlus /> Nova Conta Fixa
        </button>
      </div>

      {contasFixas.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <IconPlus />
          </div>
          <p className="text-slate-500 font-bold text-lg mb-2">Nenhuma conta fixa cadastrada</p>
          <p className="text-slate-400 text-sm">Clique no botão acima para adicionar Água, Luz, Internet...</p>
        </div>
      ) : (
        // A regra 'items-start' faz com que os cards não tentem se esticar juntos
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {contasFixas.map(conta => (
            <ContaCard 
              key={conta.id} 
              conta={conta} 
              dataFoco={dataFoco} 
              
              // Aqui controlamos para que só um card abra por vez
              isExpanded={contaExpandidaId === conta.id}
              onToggle={() => setContaExpandidaId(contaExpandidaId === conta.id ? null : conta.id)}

              onEditConta={abrirFormConta}
              onExcluirConta={excluirConta}
              onAbrirPagamento={abrirFormPagamento}
              onExcluirPagamento={excluirPagamento}
              onViewComprovante={(url) => {
                setComprovanteAtivo(url);
                setVista('view_comprovante');
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}