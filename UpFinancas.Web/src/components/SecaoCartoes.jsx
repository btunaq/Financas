import { useState } from 'react';

export default function SecaoCartoes({ comprasPorCartao, cartoes, adicionarCartao, adicionarCompra, editarCompra, excluirCompra, excluirCartao, dataFoco }) {
  const [vista, setVista] = useState('lista');

  const [compraEmExclusao, setCompraEmExclusao] = useState(null);
  const [cartaoEmExclusao, setCartaoEmExclusao] = useState(null);
  const [compraEditandoId, setCompraEditandoId] = useState(null);
  const [foiPagoEdicao, setFoiPagoEdicao] = useState(false);

  const [titular, setTitular] = useState('');
  const [cartaoId, setCartaoId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [categoria, setCategoria] = useState('Lazer / Assinaturas');
  
  const [tipoPagamento, setTipoPagamento] = useState('parcelado');
  const [parcelaAtual, setParcelaAtual] = useState(1);
  const [parcelas, setParcelas] = useState('');
  const [mostrarAntecipacao, setMostrarAntecipacao] = useState(false);
  const [qtdAntecipada, setQtdAntecipada] = useState('');

  const [nomeBanco, setNomeBanco] = useState('');
  const [corHexadecimal, setCorHexadecimal] = useState('#8A05BE');
  const [numeroFinal, setNumeroFinal] = useState('');
  const [diaFechamento, setDiaFechamento] = useState('');
  const [diaPagamento, setDiaPagamento] = useState('');

  // =========================================================
  // FÓRMULA CORRIGIDA: Respeita a ParcelaAtual do Banco de Dados
  // =========================================================
  const obterInfoParcela = (compra, dataAlvo) => {
    if (!compra.dataCompra) return { ativa: false };

    const dtCompra = new Date(compra.dataCompra);
    // Calcula a distância de meses entre o mês da compra e o mês selecionado na seta do topo
    const diferencaMeses = (dataAlvo.getFullYear() - dtCompra.getFullYear()) * 12 + (dataAlvo.getMonth() - dtCompra.getMonth());
    const totalParc = compra.quantidadeParcelas !== undefined ? compra.quantidadeParcelas : (compra.parcelas || 1);

    // Se for Assinatura Fixa (0 parcelas)
    if (totalParc === 0) {
      return { ativa: diferencaMeses >= 0, txtParcela: '♾️ ASSIN.', isAssinatura: true, totalParc: 1 };
    }

    // A mágica: Soma a distância de meses à parcela que veio gravada do banco!
    const pAtualCalculada = (compra.parcelaAtual != null ? compra.parcelaAtual : 1) + diferencaMeses;

    // A parcela só existe se estiver dentro do intervalo de 1 até o total contratado
    if (pAtualCalculada >= 1 && pAtualCalculada <= totalParc) {
      return { 
        ativa: true, 
        txtParcela: `${pAtualCalculada}/${totalParc}`, 
        isAssinatura: false,
        totalParc
      };
    }

    return { ativa: false }; // Compra já expirou ou ainda não aconteceu nesse mês alvo
  };

  const fecharFormulario = () => {
    setTitular(''); setDescricao(''); setValor(''); setData(''); 
    setParcelas(''); setParcelaAtual(1); setCategoria('Alimentação / Fast Food'); 
    setCompraEditandoId(null); setFoiPagoEdicao(false);
    setTipoPagamento('parcelado'); setMostrarAntecipacao(false); setQtdAntecipada('');
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
    setData(compra.dataCompra ? compra.dataCompra.split('T')[0] : '');
    setFoiPagoEdicao(compra.foiPago || false);
    setCategoria(compra.categoria || 'Outros');
    
    const totalParc = compra.quantidadeParcelas !== undefined ? compra.quantidadeParcelas : (compra.parcelas || 1);
    
    if (totalParc === 0) {
      setTipoPagamento('assinatura');
    } else if (totalParc === 1) {
      setTipoPagamento('avista');
    } else {
      setTipoPagamento('parcelado');
      setParcelas(totalParc);
      setParcelaAtual(compra.parcelaAtual != null ? compra.parcelaAtual : 1); 
    }
    
    setMostrarAntecipacao(false);
    setQtdAntecipada('');
    setCompraEditandoId(compra.id);
    setVista('form_compra');
  };

  const handleAlternarStatus = async (compra) => {
    const dadosAtualizados = {
      titular: compra.titular,
      descricao: compra.descricao,
      valorTotal: compra.valorTotal,
      parcelaAtual: compra.parcelaAtual,
      quantidadeParcelas: compra.quantidadeParcelas,
      dataCompra: compra.dataCompra,
      cartaoDeCreditoId: compra.cartaoDeCreditoId,
      categoria: compra.categoria || 'Outros',
      foiPago: !compra.foiPago
    };
    
    const sucesso = await editarCompra(compra.id, dadosAtualizados);
    if (!sucesso) alert("Erro ao atualizar o status.");
  };

  const handleCompraSubmit = async (e) => {
    e.preventDefault();
    const idSelecionado = cartaoId || (cartoes.length > 0 ? cartoes[0].id : null);
    if (!idSelecionado) return alert("Por favor, selecione um cartão.");

    let parcAtualFinal = parseInt(parcelaAtual) || 1;
    let totalParcFinal = parseInt(parcelas) || 1;

    if (tipoPagamento === 'avista') {
      parcAtualFinal = 1;
      totalParcFinal = 1;
    } else if (tipoPagamento === 'assinatura') {
      parcAtualFinal = 0;
      totalParcFinal = 0;
    } else if (compraEditandoId && mostrarAntecipacao && qtdAntecipada) {
      parcAtualFinal += parseInt(qtdAntecipada);
      if (parcAtualFinal > totalParcFinal) parcAtualFinal = totalParcFinal;
    }

    const dados = {
      titular, descricao, 
      valorTotal: parseFloat(valor), 
      parcelaAtual: parcAtualFinal, 
      quantidadeParcelas: totalParcFinal, 
      dataCompra: data, 
      cartaoDeCreditoId: parseInt(idSelecionado),
      categoria: categoria,
      foiPago: compraEditandoId ? foiPagoEdicao : false
    };

    let sucesso = compraEditandoId ? await editarCompra(compraEditandoId, dados) : await adicionarCompra(dados);
    if (sucesso) fecharFormulario();
    else alert("Erro ao gravar.");
  };

  const handleCartaoSubmit = async (e) => {
    e.preventDefault();
    const resultado = await adicionarCartao({ 
      nomeBanco, corHexadecimal, numeroFinal,
      diaFechamento: parseInt(diaFechamento), diaPagamento: parseInt(diaPagamento)
    });
    const sucesso = typeof resultado === 'object' ? resultado.sucesso : resultado;
    if (sucesso) { 
      setNomeBanco(''); setNumeroFinal(''); setCorHexadecimal('#8A05BE'); setDiaFechamento(''); setDiaPagamento(''); 
      setVista('lista'); 
    } else {
       alert(resultado?.erro || "Erro ao cadastrar cartão.");
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
            <label className="block text-sm font-bold text-slate-600 mb-2">Cor de Identificação</label>
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
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Categoria</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700">
              <option value="Supermercado / Feira">🛒 Supermercado / Feira</option>
              <option value="Alimentação / Fast Food">🍔 Alimentação / Fast Food</option>
              <option value="Roupas / Moda">👗 Roupas / Moda</option>
              <option value="Beleza / Cuidados">💅 Beleza / Cuidados</option>
              <option value="Acessórios para Casa">🪴 Acessórios para Casa</option>
              <option value="Casa Essencial (Luz, Água)">🏠 Casa Essencial (Luz, Água)</option>
              <option value="Transporte / Combustível">🚗 Transporte / Combustível</option>
              <option value="Lazer / Assinaturas">🎮 Lazer / Assinaturas</option>
              <option value="Outros">📌 Outros</option>
            </select>
          </div>
          <div className="mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="block text-sm font-bold text-slate-600 mb-3">Tipo de Pagamento</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={tipoPagamento === 'avista'} onChange={() => setTipoPagamento('avista')} className="w-4 h-4 accent-indigo-600" />
                <span className="font-bold text-slate-700 text-sm">À Vista</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={tipoPagamento === 'parcelado'} onChange={() => setTipoPagamento('parcelado')} className="w-4 h-4 accent-indigo-600" />
                <span className="font-bold text-slate-700 text-sm">Parcelado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={tipoPagamento === 'assinatura'} onChange={() => setTipoPagamento('assinatura')} className="w-4 h-4 accent-indigo-600" />
                <span className="font-bold text-slate-700 text-sm">Assinatura Mensal</span>
              </label>
            </div>
          </div>
          <div className={`grid ${tipoPagamento === 'parcelado' ? 'grid-cols-4' : 'grid-cols-2'} gap-4`}>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Valor</label>
              <input type="number" step="0.01" required value={valor} onChange={e => setValor(e.target.value)} placeholder="700.00" className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            {tipoPagamento === 'parcelado' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Parcela Inicial</label>
                  <input type="number" min="1" required value={parcelaAtual} onChange={e => setParcelaAtual(e.target.value)} className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Total Parcelas</label>
                  <input type="number" min="1" required value={parcelas} onChange={e => setParcelas(e.target.value)} className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Data de Lançamento</label>
              <input type="date" required value={data} onChange={e => setData(e.target.value)} className="w-full p-3 text-slate-600 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          {compraEditandoId && tipoPagamento === 'parcelado' && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100 animate-fade-in">
               {!mostrarAntecipacao ? (
                  <button type="button" onClick={() => setMostrarAntecipacao(true)} className="text-sm font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-2">
                     ⏩ Antecipar Parcelas?
                  </button>
               ) : (
                  <div className="flex flex-col gap-3">
                     <label className="text-sm font-bold text-indigo-800">Quantas parcelas você pagou adiantado?</label>
                     <div className="flex gap-3 items-center">
                       <input type="number" min="1" value={qtdAntecipada} onChange={e => setQtdAntecipada(e.target.value)} className="w-24 p-2 rounded-lg border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ex: 2" />
                       <button type="button" onClick={() => {setMostrarAntecipacao(false); setQtdAntecipada('');}} className="text-slate-500 text-sm font-bold hover:text-rose-600">Cancelar</button>
                     </div>
                  </div>
               )}
            </div>
          )}

          <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 shadow-md transition-all mt-4">Salvar</button>
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
        <h3 className="text-lg font-semibold text-slate-500">Resumo de Faturas</h3>
        <div className="flex gap-3">
          <button onClick={() => setVista('novo_cartao')} className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all">+ Novo Cartão</button>
          <button onClick={abrirNovoFormularioCompra} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-all">+ Nova Compra</button>
        </div>
      </div>

      {Object.keys(comprasPorCartao).length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-400 font-bold text-lg mb-2">Nenhuma movimentação identificada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-6">
          {Object.entries(comprasPorCartao).map(([tituloCartao, dados]) => {
            
            const partesTitulo = tituloCartao.split(' - Final ');
            const nomeDoBanco = partesTitulo[0];
            const numFinal = partesTitulo.length > 1 ? `Final ${partesTitulo[1]}` : '';

            // Filtra as compras usando a nossa nova lógica temporal dinâmica corrigida
            const comprasAtivasNoMes = dados.compras.filter(c => obterInfoParcela(c, dataFoco).ativa);

            const totalFaturaMes = comprasAtivasNoMes.reduce((acc, c) => {
              if (c.foiPago) return acc; 
              const info = obterInfoParcela(c, dataFoco);
              const totalMv = c.valorTotal || c.valor || 0;
              return acc + (totalMv / (info.totalParc || 1));
            }, 0);

            const totaisPorTitular = comprasAtivasNoMes.reduce((acc, c) => {
              if (c.foiPago) return acc; 
              const info = obterInfoParcela(c, dataFoco);
              const totalMv = c.valorTotal || c.valor || 0;
              const valorParc = totalMv / (info.totalParc || 1);
              
              let nomeFormatado = c.titular ? c.titular.trim().toLowerCase() : 'desconhecido';
              nomeFormatado = nomeFormatado.charAt(0).toUpperCase() + nomeFormatado.slice(1);
              acc[nomeFormatado] = (acc[nomeFormatado] || 0) + valorParc;
              return acc;
            }, {});

            return (
              <div key={tituloCartao} className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative" style={{ borderLeft: `6px solid ${dados.cor}` }}>
                
                <div className="px-5 py-4 flex flex-row items-start justify-between border-b border-slate-100 gap-4 shrink-0 bg-white z-20">
                  <div className="flex flex-col gap-3 min-w-[140px]">
                    <div>
                      <h4 className="text-lg font-bold flex items-center gap-2">
                        <span className="text-slate-300 opacity-60">💳</span>
                        <span style={{ color: dados.cor }}>{nomeDoBanco}</span>
                        {numFinal && <span className="text-slate-500 font-medium text-sm">{numFinal}</span>}
                      </h4>
                      <p className="text-[10px] font-bold mt-0.5 tracking-wide text-slate-400 uppercase">
                        FECHA DIA {dados.diaFechamento || '--'} • VENCE DIA {dados.diaPagamento || '--'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block leading-tight">Fatura</span>
                      <span className="text-xl font-black text-slate-800 leading-tight">R$ {totalFaturaMes.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 border-l border-slate-100/50 pl-4">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(totaisPorTitular).map(([nome, valor]) => (
                        <div key={nome} className="flex justify-between items-center bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200 shadow-sm">
                          <span className="text-[10px] font-bold text-slate-500 uppercase truncate mr-2" title={nome}>{nome}</span>
                          <span className="text-xs font-black text-slate-800 whitespace-nowrap">R$ {valor.toFixed(2)}</span>
                        </div>
                      ))}
                      {Object.keys(totaisPorTitular).length === 0 && (
                        <span className="text-xs text-slate-400 font-medium italic col-span-2">Fatura Zerada</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-start items-end pl-2">
                    {dados.cartaoId && (
                      <button onClick={() => setCartaoEmExclusao(dados.cartaoId)} className="text-slate-300 hover:text-rose-500 transition-colors font-bold text-2xl leading-none">×</button>
                    )}
                  </div>
                </div>

                {/* Exibição limpa limitando a max-h e com barra invisível */}
                <div className="flex-1 overflow-y-auto w-full relative max-h-[320px] hide-scroll">
                  <table className="w-full text-left text-sm table-auto">
                    <thead className="bg-white text-slate-400 font-bold uppercase text-[9px] tracking-wider sticky top-0 z-10 shadow-sm border-b border-slate-100">
                      <tr>
                        <th className="px-2 py-3 bg-white">Status</th>
                        <th className="px-2 py-3 bg-white">Titular / Categoria</th>
                        <th className="px-2 py-3 bg-white">Descrição</th>
                        <th className="px-2 py-3 bg-white text-center">Parc.</th>
                        <th className="px-2 py-3 bg-white text-right">Valor</th>
                        <th className="px-2 py-3 bg-white text-right">Total</th>
                        <th className="px-2 py-3 bg-white text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {comprasAtivasNoMes.map(compra => {
                        const info = obterInfoParcela(compra, dataFoco);
                        const vTotal = compra.valorTotal || compra.valor || 0;
                        const vParc = vTotal / (info.totalParc || 1);

                        return (
                          <tr key={compra.id} className={`hover:bg-slate-50 transition-colors ${compra.foiPago ? 'opacity-50' : ''}`}>
                            <td className="px-2 py-3 whitespace-nowrap">
                              <button onClick={() => handleAlternarStatus(compra)} className={`px-2 py-1 rounded text-[9px] font-black tracking-widest transition-all shadow-sm border ${compra.foiPago ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                {compra.foiPago ? 'PAGO' : 'PENDENTE'}
                              </button>
                            </td>
                            <td className="px-2 py-3">
                              <p className="font-bold text-slate-700 text-xs truncate max-w-[80px]">{compra.titular}</p>
                              <p className="text-[10px] text-slate-400 font-medium truncate max-w-[80px]">{compra.categoria}</p>
                            </td>
                            <td className="px-2 py-3">
                              <p className={`font-medium text-xs truncate max-w-[100px] ${compra.foiPago ? 'line-through text-slate-400' : 'text-slate-600'}`}>{compra.descricao}</p>
                            </td>
                            <td className="px-2 py-3 text-center whitespace-nowrap">
                              <span className={`${info.isAssinatura ? 'text-fuchsia-600' : 'text-indigo-500'} font-bold text-xs`}>
                                {info.txtParcela}
                              </span>
                            </td>
                            <td className="px-2 py-3 text-right whitespace-nowrap">
                               <p className="font-bold text-slate-700 text-xs">R$ {vParc.toFixed(2)}</p>
                            </td>
                            <td className="px-2 py-3 text-right whitespace-nowrap">
                               <p className="font-bold text-slate-800 text-xs">{info.isAssinatura ? 'Mensal' : `R$ ${vTotal.toFixed(2)}`}</p>
                            </td>
                            <td className="px-2 py-3 text-center whitespace-nowrap">
                              {compraEmExclusao === compra.id ? (
                                <div className="flex justify-center gap-1 bg-rose-50 p-1 rounded border border-rose-200 animate-fade-in">
                                  <button onClick={() => { excluirCompra(compra.id); setCompraEmExclusao(null); }} className="text-emerald-600 hover:bg-emerald-100 px-1.5 py-0.5 rounded text-sm font-bold">✔️</button>
                                  <button onClick={() => setCompraEmExclusao(null)} className="text-rose-600 hover:bg-rose-100 px-1.5 py-0.5 rounded text-sm font-bold">❌</button>
                                </div>
                              ) : (
                                <div className="flex justify-center items-center space-x-2 opacity-80 hover:opacity-100">
                                  <button onClick={() => iniciarEdicao(compra)} className="text-indigo-500 text-lg">✏️</button>
                                  <button onClick={() => setCompraEmExclusao(compra.id)} className="text-rose-500 text-lg font-black">✕</button>
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