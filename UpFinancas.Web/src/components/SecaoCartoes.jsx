import { useState } from 'react';

export default function SecaoCartoes({ comprasPorCartao, cartoes, adicionarCartao, adicionarCompra, editarCompra, excluirCompra, excluirCartao, dataFoco }) {
  const [vista, setVista] = useState('lista');

  const [compraEmExclusao, setCompraEmExclusao] = useState(null);
  const [cartaoEmExclusao, setCartaoEmExclusao] = useState(null);
  const [compraEditandoId, setCompraEditandoId] = useState(null);
  const [foiPagoEdicao, setFoiPagoEdicao] = useState(false);

  const [pagamentoEmConfirmacao, setPagamentoEmConfirmacao] = useState(null);
  const [pendenteEmConfirmacao, setPendenteEmConfirmacao] = useState(null);

  const [titular, setTitular] = useState('');
  const [cartaoId, setCartaoId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [categoria, setCategoria] = useState('Lazer / Assinaturas');
  
  const [tipoPagamento, setTipoPagamento] = useState('parcelado');
  const [parcelaAtual, setParcelaAtual] = useState(1);
  const [parcelas, setParcelas] = useState('');
  const [mesesPagosForm, setMesesPagosForm] = useState('');
  const [mostrarAntecipacao, setMostrarAntecipacao] = useState(false);
  const [qtdAntecipada, setQtdAntecipada] = useState('');

  const [nomeBanco, setNomeBanco] = useState('');
  const [corHexadecimal, setCorHexadecimal] = useState('#8A05BE');
  const [numeroFinal, setNumeroFinal] = useState('');
  const [diaFechamento, setDiaFechamento] = useState('');
  const [diaPagamento, setDiaPagamento] = useState('');

  const [filtrosTitular, setFiltrosTitular] = useState({});

  const obterInfoParcela = (compra, dataAlvo) => {
    if (!compra.dataCompra) return { ativa: false };

    const dtCompra = new Date(compra.dataCompra);
    const diferencaMeses = (dataAlvo.getFullYear() - dtCompra.getFullYear()) * 12 + (dataAlvo.getMonth() - dtCompra.getMonth());
    const totalParc = compra.quantidadeParcelas !== undefined ? compra.quantidadeParcelas : (compra.parcelas || 1);

    const chaveMes = `${dataAlvo.getFullYear()}-${String(dataAlvo.getMonth() + 1).padStart(2, '0')}`;
    const isPago = (compra.mesesPagos || "").includes(chaveMes);

    if (totalParc === 0) {
      return { ativa: diferencaMeses >= 0, txtParcela: '♾️ ASSIN.', isAssinatura: true, totalParc: 1, chaveMes, isPago };
    }

    const pAtualCalculada = (compra.parcelaAtual != null ? compra.parcelaAtual : 1) + diferencaMeses;

    if (pAtualCalculada >= 1 && pAtualCalculada <= totalParc) {
      return { ativa: true, txtParcela: `${pAtualCalculada}/${totalParc}`, isAssinatura: false, totalParc, chaveMes, isPago };
    }

    return { ativa: false };
  };

  const fecharFormulario = () => {
    setTitular(''); setDescricao(''); setValor(''); setData(''); 
    setParcelas(''); setParcelaAtual(1); setCategoria('Alimentação / Fast Food'); 
    setCompraEditandoId(null); setFoiPagoEdicao(false); setMesesPagosForm('');
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
    setMesesPagosForm(compra.mesesPagos || '');
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

  const handleAlternarStatus = async (item) => {
    let novosMesesPagos = item.original.mesesPagos || "";
    
    if (item.info.isPago) {
      novosMesesPagos = novosMesesPagos.replace(item.info.chaveMes, "").split(',').filter(m => m).join(',');
    } else {
      novosMesesPagos = novosMesesPagos ? `${novosMesesPagos},${item.info.chaveMes}` : item.info.chaveMes;
    }

    const dadosAtualizados = { ...item.original, mesesPagos: novosMesesPagos };
    const sucesso = await editarCompra(item.original.id, dadosAtualizados);
    if (!sucesso) alert("Erro ao atualizar o status.");
  };

  const confirmarPagamentoLote = async (cartaoIdSelecionado, comprasMapeadas, titularFiltrado) => {
    let comprasPendentes = comprasMapeadas.filter(item => !item.info.isPago);

    if (titularFiltrado) {
       comprasPendentes = comprasPendentes.filter(item => {
         let nomeFormatado = item.original.titular ? item.original.titular.trim().toLowerCase() : 'desconhecido';
         return (nomeFormatado.charAt(0).toUpperCase() + nomeFormatado.slice(1)) === titularFiltrado;
       });
    }

    try {
      await Promise.all(comprasPendentes.map(item => {
        const novosMeses = item.original.mesesPagos ? `${item.original.mesesPagos},${item.info.chaveMes}` : item.info.chaveMes;
        return editarCompra(item.original.id, { ...item.original, mesesPagos: novosMeses });
      }));
    } catch (error) { alert("Erro ao processar pagamentos."); }
    setPagamentoEmConfirmacao(null);
  };

  const confirmarPendenteLote = async (cartaoIdSelecionado, comprasMapeadas, titularFiltrado) => {
    let comprasPagas = comprasMapeadas.filter(item => item.info.isPago);

    if (titularFiltrado) {
       comprasPagas = comprasPagas.filter(item => {
         let nomeFormatado = item.original.titular ? item.original.titular.trim().toLowerCase() : 'desconhecido';
         return (nomeFormatado.charAt(0).toUpperCase() + nomeFormatado.slice(1)) === titularFiltrado;
       });
    }

    try {
      await Promise.all(comprasPagas.map(item => {
        const novosMeses = (item.original.mesesPagos || "").replace(item.info.chaveMes, "").split(',').filter(m => m).join(',');
        return editarCompra(item.original.id, { ...item.original, mesesPagos: novosMeses });
      }));
    } catch (error) { alert("Erro ao reverter para pendente."); }
    setPendenteEmConfirmacao(null);
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
      foiPago: compraEditandoId ? foiPagoEdicao : false,
      mesesPagos: mesesPagosForm 
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
            <label className="block text-sm font-bold text-slate-600 mb-2">Descrição da Compra / Nome da Assinatura</label>
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

            const toggleFiltro = (nomeSelecionado) => {
              setFiltrosTitular(prev => ({
                ...prev,
                [tituloCartao]: prev[tituloCartao] === nomeSelecionado ? null : nomeSelecionado
              }));
              setPagamentoEmConfirmacao(null);
              setPendenteEmConfirmacao(null);
            };

            const filtroAtivo = filtrosTitular[tituloCartao];
            const comprasAtivasMapeadas = dados.compras
              .map(c => ({ original: c, info: obterInfoParcela(c, dataFoco) }))
              .filter(item => item.info.ativa);

            const totalFaturaMes = comprasAtivasMapeadas.reduce((acc, item) => {
              if (item.info.isPago) return acc; 
              const totalMv = item.original.valorTotal || item.original.valor || 0;
              return acc + (totalMv / (item.info.totalParc || 1));
            }, 0);

            // LOGICA ALTERADA AQUI: Adiciona sempre o nome, mas só soma o valor se NÃO estiver pago.
            const totaisPorTitular = comprasAtivasMapeadas.reduce((acc, item) => {
              let nomeFormatado = item.original.titular ? item.original.titular.trim().toLowerCase() : 'desconhecido';
              nomeFormatado = nomeFormatado.charAt(0).toUpperCase() + nomeFormatado.slice(1);
              
              // Garante que a pessoa existe na lista (mesmo que o valor seja 0 depois)
              if (!acc[nomeFormatado]) {
                acc[nomeFormatado] = 0;
              }

              // Só soma o valor do dinheiro se a conta AINDA NÃO estiver paga
              if (!item.info.isPago) {
                const totalMv = item.original.valorTotal || item.original.valor || 0;
                const valorParc = totalMv / (item.info.totalParc || 1);
                acc[nomeFormatado] += valorParc;
              }
              
              return acc;
            }, {});

            const comprasFiltradas = filtroAtivo 
              ? comprasAtivasMapeadas.filter(item => {
                  let nomeFormatado = item.original.titular ? item.original.titular.trim().toLowerCase() : 'desconhecido';
                  return (nomeFormatado.charAt(0).toUpperCase() + nomeFormatado.slice(1)) === filtroAtivo;
                })
              : comprasAtivasMapeadas;

            const temComprasPendentesNaTabela = comprasFiltradas.some(item => !item.info.isPago);
            const temComprasPagasNaTabela = comprasFiltradas.some(item => item.info.isPago);

            return (
              <div key={tituloCartao} className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative" style={{ borderLeft: `6px solid ${dados.cor}`, height: '500px' }}>
                
                <div className="px-5 py-4 flex flex-row items-start justify-between border-b border-slate-100 gap-4 shrink-0 bg-white z-20">
                  <div className="flex flex-col gap-2 min-w-[140px]">
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
                    
                    <div className="h-7 mt-1 flex items-center">
                      {temComprasPendentesNaTabela ? (
                        pagamentoEmConfirmacao === dados.cartaoId ? (
                          <div className="flex gap-1 bg-emerald-50 p-0.5 rounded border border-emerald-200 animate-fade-in w-fit shadow-sm">
                            <button onClick={() => confirmarPagamentoLote(dados.cartaoId, comprasAtivasMapeadas, filtroAtivo)} className="text-emerald-700 hover:bg-emerald-100 px-2 py-1 rounded text-[10px] font-black tracking-widest flex items-center gap-1 transition-colors">
                              <span>✔️</span> SIM
                            </button>
                            <button onClick={() => setPagamentoEmConfirmacao(null)} className="text-rose-600 hover:bg-rose-100 px-2 py-1 rounded text-[10px] font-black tracking-widest transition-colors">
                              ❌ NÃO
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setPagamentoEmConfirmacao(dados.cartaoId)} className="text-[9px] font-black tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-1.5 rounded hover:bg-emerald-100 transition-colors shadow-sm w-fit">
                            ✓ {filtroAtivo ? `PAGAR ${filtroAtivo.toUpperCase()}` : 'PAGAR TUDO'}
                          </button>
                        )
                      ) : temComprasPagasNaTabela ? (
                        pendenteEmConfirmacao === dados.cartaoId ? (
                          <div className="flex gap-1 bg-amber-50 p-0.5 rounded border border-amber-200 animate-fade-in w-fit shadow-sm">
                            <button onClick={() => confirmarPendenteLote(dados.cartaoId, comprasAtivasMapeadas, filtroAtivo)} className="text-amber-700 hover:bg-amber-100 px-2 py-1 rounded text-[10px] font-black tracking-widest flex items-center gap-1 transition-colors">
                              <span>✔️</span> SIM
                            </button>
                            <button onClick={() => setPendenteEmConfirmacao(null)} className="text-rose-600 hover:bg-rose-100 px-2 py-1 rounded text-[10px] font-black tracking-widest transition-colors">
                              ❌ NÃO
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setPendenteEmConfirmacao(dados.cartaoId)} className="text-[9px] font-black tracking-widest bg-amber-50 text-amber-600 border border-amber-200 px-2 py-1.5 rounded hover:bg-amber-100 transition-colors shadow-sm w-fit">
                            ⟲ {filtroAtivo ? `VOLTAR ${filtroAtivo.toUpperCase()}` : 'TUDO PENDENTE'}
                          </button>
                        )
                      ) : null}
                    </div>
                  </div>
                  
                  <div className="flex-1 border-l border-slate-100/50 pl-4">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(totaisPorTitular).map(([nome, valor]) => {
                        const isSelecionado = filtroAtivo === nome;
                        return (
                          <div 
                            key={nome} 
                            onClick={() => toggleFiltro(nome)}
                            className={`flex justify-between items-center px-2.5 py-1.5 rounded-md border shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 ${
                              isSelecionado ? '' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                            style={isSelecionado ? { backgroundColor: dados.cor, borderColor: dados.cor } : {}}
                            title={isSelecionado ? "Clique para limpar o filtro" : `Clique para ver apenas os gastos de ${nome}`}
                          >
                            <span className={`text-[10px] font-bold uppercase truncate mr-2 ${isSelecionado ? 'text-white opacity-90' : 'text-slate-500'}`}>{nome}</span>
                            <span className={`text-xs font-black whitespace-nowrap ${isSelecionado ? 'text-white' : 'text-slate-800'}`}>R$ {valor.toFixed(2)}</span>
                          </div>
                        );
                      })}
                      {Object.keys(totaisPorTitular).length === 0 && (
                        <span className="text-xs text-slate-400 font-medium italic col-span-2">Nenhuma compra ativa</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-start items-end pl-2">
                    {dados.cartaoId && (
                      <button onClick={() => setCartaoEmExclusao(dados.cartaoId)} className="text-slate-300 hover:text-rose-500 transition-colors font-bold text-2xl leading-none">×</button>
                    )}
                  </div>
                </div>

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
                      {comprasFiltradas.length === 0 ? (
                        <tr>
                           <td colSpan="7" className="text-center py-8 text-slate-400 font-medium italic">
                             Nenhuma compra encontrada neste mês.
                           </td>
                        </tr>
                      ) : (
                        comprasFiltradas.map(item => {
                          const vTotal = item.original.valorTotal || item.original.valor || 0;
                          const vParc = vTotal / (item.info.totalParc || 1);

                          return (
                            <tr key={item.original.id} className={`hover:bg-slate-50 transition-colors ${item.info.isPago ? 'opacity-50' : ''}`}>
                              <td className="px-2 py-3 whitespace-nowrap">
                                <button 
                                  onClick={() => handleAlternarStatus(item)} 
                                  className={`px-2 py-1 rounded text-[9px] font-black tracking-widest transition-all shadow-sm border ${item.info.isPago ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'}`}
                                  title={item.info.isPago ? "Clique para marcar como Pendente" : "Clique para marcar como Pago"}
                                >
                                  {item.info.isPago ? 'PAGO' : 'PENDENTE'}
                                </button>
                              </td>
                              <td className="px-2 py-3">
                                <p className="font-bold text-slate-700 text-xs truncate max-w-[80px]">{item.original.titular}</p>
                                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[80px]">{item.original.categoria}</p>
                              </td>
                              <td className="px-2 py-3">
                                <p className={`font-medium text-xs truncate max-w-[100px] ${item.info.isPago ? 'line-through text-slate-400' : 'text-slate-600'}`}>{item.original.descricao}</p>
                              </td>
                              <td className="px-2 py-3 text-center whitespace-nowrap">
                                <span className={`${item.info.isAssinatura ? 'text-fuchsia-600' : 'text-indigo-500'} font-bold text-xs`}>
                                  {item.info.txtParcela}
                               </span>
                              </td>
                              <td className="px-2 py-3 text-right whitespace-nowrap">
                                 <p className="font-bold text-slate-700 text-xs">R$ {vParc.toFixed(2)}</p>
                              </td>
                              <td className="px-2 py-3 text-right whitespace-nowrap">
                                 <p className="font-bold text-slate-800 text-xs">{item.info.isAssinatura ? 'Mensal' : `R$ ${vTotal.toFixed(2)}`}</p>
                              </td>
                              <td className="px-2 py-3 text-center whitespace-nowrap">
                                <div className="flex justify-center items-center space-x-2 opacity-80 hover:opacity-100">
                                  <button onClick={() => iniciarEdicao(item.original)} className="text-indigo-500 text-lg">✏️</button>
                                  <button onClick={() => setCompraEmExclusao(item.original.id)} className="text-rose-500 text-lg font-black">✕</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
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