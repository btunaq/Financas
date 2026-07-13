import { useState, useEffect } from 'react';

export default function SecaoCartoes({ comprasPorCartao, cartoes, adicionarCartao, adicionarCompra, editarCompra, excluirCompra, excluirCartao }) {
  const [vista, setVista] = useState('lista');

  const [compraEmExclusao, setCompraEmExclusao] = useState(null);
  const [cartaoEmExclusao, setCartaoEmExclusao] = useState(null);
  const [compraEditandoId, setCompraEditandoId] = useState(null);
  const [foiPagoEdicao, setFoiPagoEdicao] = useState(false);

  const [titular, setTitular] = useState('');
  const [cartaoId, setCartaoId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [parcelaAtual, setParcelaAtual] = useState(1);
  const [parcelas, setParcelas] = useState('');
  const [data, setData] = useState('');

  // Estados do Novo Cartão
  const [nomeBanco, setNomeBanco] = useState('');
  const [corHexadecimal, setCorHexadecimal] = useState('#8A05BE');
  const [numeroFinal, setNumeroFinal] = useState('');
  const [diaFechamento, setDiaFechamento] = useState('');
  const [diaPagamento, setDiaPagamento] = useState('');

  const fecharFormulario = () => {
    setTitular(''); setDescricao(''); setValor(''); setParcelas(''); setParcelaAtual(1); setData(''); 
    setCompraEditandoId(null); setFoiPagoEdicao(false);
    setVista('lista');
  };

  const abrirNovoFormularioCompra = () => {
    fecharFormulario();
    if (cartoes.length > 0) setCartaoId(cartoes[0].id); 
    else setCartaoId('');
    setVista('form_compra');
  };

  const iniciarEdicao = (compra) => {
    setTitular(compra.titular);
    setCartaoId(compra.cartaoDeCreditoId || '');
    setDescricao(compra.descricao);
    setValor(compra.valorTotal || compra.valor);
    setParcelaAtual(compra.parcelaAtual != null ? compra.parcelaAtual : 1); 
    setParcelas(compra.quantidadeParcelas || compra.parcelas);
    setData(compra.dataCompra ? compra.dataCompra.split('T')[0] : '');
    setFoiPagoEdicao(compra.foiPago || false);
    
    setCompraEditandoId(compra.id);
    setVista('form_compra');
  };

  // FUNÇÃO MÁGICA DO BOTÃO PAGO/PENDENTE
  const handleAlternarStatus = async (compra) => {
    const dadosAtualizados = {
      titular: compra.titular,
      descricao: compra.descricao,
      valorTotal: compra.valorTotal,
      parcelaAtual: compra.parcelaAtual,
      quantidadeParcelas: compra.quantidadeParcelas,
      dataCompra: compra.dataCompra,
      cartaoDeCreditoId: compra.cartaoDeCreditoId,
      foiPago: !compra.foiPago // Inverte o status atual!
    };
    
    const sucesso = await editarCompra(compra.id, dadosAtualizados);
    if (!sucesso) alert("Erro ao atualizar o status do pagamento.");
  };

  const handleCompraSubmit = async (e) => {
    e.preventDefault();
    const idSelecionado = cartaoId || (cartoes.length > 0 ? cartoes[0].id : null);
    if (!idSelecionado) return alert("Por favor, selecione um cartão.");

    const dados = {
      titular, 
      descricao, 
      valorTotal: parseFloat(valor), 
      parcelaAtual: parseInt(parcelaAtual), 
      quantidadeParcelas: parseInt(parcelas), 
      dataCompra: data, 
      cartaoDeCreditoId: parseInt(idSelecionado),
      foiPago: compraEditandoId ? foiPagoEdicao : false
    };

    let sucesso = compraEditandoId ? await editarCompra(compraEditandoId, dados) : await adicionarCompra(dados);
    if (sucesso) fecharFormulario();
    else alert("Erro ao gravar no .NET.");
  };

  const handleCartaoSubmit = async (e) => {
    e.preventDefault();
    const sucesso = await adicionarCartao({ 
      nomeBanco, 
      corHexadecimal, 
      numeroFinal,
      diaFechamento: parseInt(diaFechamento),
      diaPagamento: parseInt(diaPagamento)
    });
    if (sucesso) { 
      setNomeBanco(''); setNumeroFinal(''); setDiaFechamento(''); setDiaPagamento(''); 
      setVista('lista'); 
    }
  };

  if (vista === 'novo_cartao') {
    return (
      <div className="animate-fade-in max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h3 className="text-2xl font-black text-slate-800">Novo Cartão de Crédito</h3>
          <button onClick={() => setVista('lista')} className="text-slate-500 hover:text-rose-600 font-bold transition-colors">✕ Cancelar</button>
        </div>
        <form onSubmit={handleCartaoSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Banco / Emissor</label>
              <input required value={nomeBanco} onChange={e => setNomeBanco(e.target.value)} placeholder="Ex: Nubank" className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Últimos 4 Dígitos</label>
              <input required maxLength="4" value={numeroFinal} onChange={e => setNumeroFinal(e.target.value.replace(/\D/g, ''))} placeholder="Ex: 1234" className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Dia de Fechamento</label>
              <input required type="number" min="1" max="31" value={diaFechamento} onChange={e => setDiaFechamento(e.target.value)} placeholder="Ex: 10" className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Dia de Vencimento</label>
              <input required type="number" min="1" max="31" value={diaPagamento} onChange={e => setDiaPagamento(e.target.value)} placeholder="Ex: 17" className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Cor</label>
            <div className="flex gap-4 items-center">
              <input type="color" value={corHexadecimal} onChange={e => setCorHexadecimal(e.target.value)} className="w-16 h-12 rounded border cursor-pointer" />
              <span className="text-slate-500 font-mono text-sm uppercase">{corHexadecimal}</span>
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 shadow-md transition-all">Salvar Cartão</button>
        </form>
      </div>
    );
  }

  if (vista === 'form_compra') {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h3 className="text-2xl font-black text-slate-800">{compraEditandoId ? 'Editar Compra' : 'Cadastrar Nova Compra'}</h3>
          <button onClick={fecharFormulario} className="text-slate-500 hover:text-rose-600 font-bold transition-colors">✕ Cancelar</button>
        </div>

        <form onSubmit={handleCompraSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Titular da Compra</label>
              <input required value={titular} onChange={e => setTitular(e.target.value)} placeholder="Ex: Bruna" className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Selecione o Cartão</label>
              <select value={cartaoId} onChange={e => setCartaoId(e.target.value)} className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                {cartoes.map(c => <option key={c.id} value={c.id}>{c.nomeBanco} {c.numeroFinal ? `(Final ${c.numeroFinal})` : ''}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Descrição da Compra</label>
            <input required value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Monitor PC" className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Valor Total</label>
              <input type="number" step="0.01" required value={valor} onChange={e => setValor(e.target.value)} placeholder="700.00" className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Parcela Atual</label>
              <input type="number" min="1" required value={parcelaAtual} onChange={e => setParcelaAtual(e.target.value)} placeholder="1" className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Total Parcelas</label>
              <input type="number" min="1" required value={parcelas} onChange={e => setParcelas(e.target.value)} placeholder="7" className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Data</label>
              <input type="date" required value={data} onChange={e => setData(e.target.value)} className="w-full p-3 text-slate-600 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          
          <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 shadow-md transition-all">
            {compraEditandoId ? 'Atualizar Compra' : 'Gravar Compra'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-semibold text-slate-500">Resumo de Faturas</h3>
        <div className="flex gap-3">
          <button onClick={() => setVista('novo_cartao')} className="border border-indigo-600 text-indigo-600 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-all">+ Novo Cartão</button>
          <button onClick={abrirNovoFormularioCompra} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-all">+ Nova Compra</button>
        </div>
      </div>

      {Object.keys(comprasPorCartao).length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-400 font-bold text-lg mb-2">Nenhuma movimentação identificada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(comprasPorCartao).map(([tituloCartao, dados]) => {
            
            // CÁLCULO DA FATURA: Ignora as compras que já foram pagas!
            const totalFaturaMes = dados.compras.reduce((acc, c) => {
              if (c.foiPago) return acc; // <-- Pula a soma desta compra!
              
              const totalMv = c.valorTotal || c.valor || 0;
              const qtdParc = c.quantidadeParcelas || c.parcelas || 1;
              return acc + (totalMv / qtdParc);
            }, 0);

            return (
              <div key={tituloCartao} className="flex flex-col border rounded-2xl overflow-hidden shadow-sm bg-white" style={{ borderColor: `${dados.cor}40` }}>
                
                <div className="px-6 py-4 flex justify-between items-center border-b" style={{ backgroundColor: `${dados.cor}10`, borderColor: `${dados.cor}20` }}>
                  <div>
                    <h4 className="text-xl font-black flex items-center gap-2" style={{ color: dados.cor, WebkitTextStroke: '0.7px #1e293b', textShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}>
                      💳 {tituloCartao}
                    </h4>
                    {/* EXIBIÇÃO DOS DIAS DO CARTÃO ABAIXO DO NOME */}
                    <p className="text-[11px] font-bold mt-1 tracking-wide opacity-80" style={{ color: dados.cor }}>
                      FECHA DIA {dados.diaFechamento || '--'} • VENCE DIA {dados.diaPagamento || '--'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block leading-tight">Fatura Deste Mês</span>
                      <span className="text-lg font-black text-slate-800 leading-tight">R$ {totalFaturaMes.toFixed(2)}</span>
                    </div>
                    {dados.cartaoId && (
                      <div className="border-l border-slate-200 pl-3">
                        {cartaoEmExclusao === dados.cartaoId ? (
                          <div className="flex gap-1 bg-rose-50 p-1 rounded border border-rose-200 animate-fade-in">
                            <button onClick={() => { excluirCartao(dados.cartaoId); setCartaoEmExclusao(null); }} className="text-emerald-600 hover:bg-emerald-100 px-2 py-1 rounded text-sm font-bold">✔️</button>
                            <button onClick={() => setCartaoEmExclusao(null)} className="text-rose-600 hover:bg-rose-100 px-2 py-1 rounded text-sm font-bold">❌</button>
                          </div>
                        ) : (
                          <button onClick={() => setCartaoEmExclusao(dados.cartaoId)} className="text-slate-300 hover:text-rose-500 transition-colors" title="Apagar Cartão">✖️</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Titular</th>
                        <th className="px-4 py-3">Descrição</th>
                        <th className="px-4 py-3 text-center">Parc.</th>
                        <th className="px-4 py-3 text-right">Valor Parc.</th>
                        <th className="px-4 py-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dados.compras.map(compra => {
                        const vTotal = compra.valorTotal || compra.valor || 0;
                        const tParc = compra.quantidadeParcelas || compra.parcelas || 1;
                        const vParc = vTotal / tParc;

                        return (
                          <tr key={compra.id} className={`hover:bg-slate-50 transition-colors ${compra.foiPago ? 'opacity-60 bg-slate-50/50' : ''}`}>
                            <td className="px-4 py-3">
                              {/* BOTÃO QUE ALTERNA ENTRE PENDENTE E PAGO */}
                              <button 
                                onClick={() => handleAlternarStatus(compra)}
                                className={`px-2 py-1.5 rounded text-[10px] font-black tracking-widest transition-all shadow-sm ${
                                  compra.foiPago 
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                }`}
                              >
                                {compra.foiPago ? 'PAGO' : 'PENDENTE'}
                              </button>
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-700">{compra.titular}</td>
                            <td className="px-4 py-3">
                              <p className={`font-medium truncate max-w-[120px] ${compra.foiPago ? 'line-through text-slate-400' : 'text-slate-600'}`}>{compra.descricao}</p>
                              <p className="text-[10px] text-slate-400">{compra.dataCompra ? new Date(compra.dataCompra).toLocaleDateString() : 'S/D'}</p>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="bg-slate-100 px-2 py-1 rounded text-indigo-700 font-black text-xs">
                                {compra.parcelaAtual != null ? compra.parcelaAtual : 1}/{tParc}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-black text-slate-800">
                              R$ {vParc.toFixed(2)}
                            </td>
                            
                            <td className="px-4 py-3 text-center">
                              {compraEmExclusao === compra.id ? (
                                <div className="flex justify-center gap-1 bg-rose-50 p-1 rounded border border-rose-200 animate-fade-in">
                                  <button onClick={() => { excluirCompra(compra.id); setCompraEmExclusao(null); }} className="text-emerald-600 hover:bg-emerald-100 px-1.5 py-0.5 rounded text-sm font-bold">✔️</button>
                                  <button onClick={() => setCompraEmExclusao(null)} className="text-rose-600 hover:bg-rose-100 px-1.5 py-0.5 rounded text-sm font-bold">❌</button>
                                </div>
                              ) : (
                                <div className="space-x-1">
                                  <button onClick={() => iniciarEdicao(compra)} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded" title="Editar">✏️</button>
                                  <button onClick={() => setCompraEmExclusao(compra.id)} className="text-rose-600 bg-rose-50 hover:bg-rose-100 p-1.5 rounded" title="Excluir">🗑️</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}