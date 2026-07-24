import { useState } from 'react';

const IconPencil = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.112l-2.051.683a.75.75 0 01-.955-.955l.683-2.051a4.5 4.5 0 011.112-1.89l13.438-13.438zM16.862 4.487L19.5 7.125" /></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const IconX = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const IconCard = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>;
const IconAlert = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>;

export default function SecaoCartoes({ comprasPorCartao, cartoes, adicionarCartao, adicionarCompra, editarCompra, excluirCompra, excluirCartao, dataFoco, dataSimulada }) {
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

  const mesNomes = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

  const obterInfoParcela = (compra, dataAlvo, diaFechamento) => {
    if (!compra.dataCompra) return { ativa: false };

    const [anoStr, mesStr, diaStr] = compra.dataCompra.split('T')[0].split('-');
    const anoCompra = parseInt(anoStr);
    const mesCompra = parseInt(mesStr) - 1; 
    const diaCompra = parseInt(diaStr);

    let dataBaseCompra = new Date(anoCompra, mesCompra, 1);
    
    const fechamento = parseInt(diaFechamento) || 31;
    if (diaCompra > fechamento) {
      dataBaseCompra.setMonth(dataBaseCompra.getMonth() + 1);
    }

    const diferencaMeses = (dataAlvo.getFullYear() - dataBaseCompra.getFullYear()) * 12 + (dataAlvo.getMonth() - dataBaseCompra.getMonth());
    const totalParc = compra.quantidadeParcelas !== undefined ? compra.quantidadeParcelas : (compra.parcelas || 1);

    const chaveMes = `${dataAlvo.getFullYear()}-${String(dataAlvo.getMonth() + 1).padStart(2, '0')}`;
    const isPago = (compra.mesesPagos || "").includes(chaveMes);

    if (totalParc === 0) {
      return { ativa: diferencaMeses >= 0, txtParcela: 'ASSIN.', isAssinatura: true, totalParc: 1, chaveMes, isPago };
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

  const pagarFaturaPassada = async (itensAtrasados) => {
    try {
      await Promise.all(itensAtrasados.map(item => {
        if(!item.info.isPago) {
            const novosMeses = item.original.mesesPagos ? `${item.original.mesesPagos},${item.info.chaveMes}` : item.info.chaveMes;
            return editarCompra(item.original.id, { ...item.original, mesesPagos: novosMeses });
        }
      }));
    } catch (error) { alert("Erro ao quitar fatura antiga."); }
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
              <option value="Supermercado / Feira">Supermercado / Feira</option>
              <option value="Alimentação / Fast Food">Alimentação / Fast Food</option>
              <option value="Roupas / Moda">Roupas / Moda</option>
              <option value="Beleza / Cuidados">Beleza / Cuidados</option>
              <option value="Acessórios para Casa">Acessórios para Casa</option>
              <option value="Casa Essencial (Luz, Água)">Casa Essencial (Luz, Água)</option>
              <option value="Transporte / Combustível">Transporte / Combustível</option>
              <option value="Lazer / Assinaturas">Lazer / Assinaturas</option>
              <option value="Outros">Outros</option>
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
                      Antecipar Parcelas?
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
        /* GRID DE 2 COLUNAS PARA DEIXAR OS TITULARES LARGOS E ESPAÇOSOS */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            const fechamentoCartao = parseInt(dados.diaFechamento) || 31;
            const vencimentoCartao = parseInt(dados.diaPagamento) || 1;
            
            const comprasAtivasMapeadas = dados.compras
              .map(c => ({ original: c, info: obterInfoParcela(c, dataFoco, fechamentoCartao) }))
              .filter(item => item.info.ativa);

            const totalFaturaMes = comprasAtivasMapeadas.reduce((acc, item) => {
              if (item.info.isPago) return acc; 
              const totalMv = item.original.valorTotal || item.original.valor || 0;
              return acc + (totalMv / (item.info.totalParc || 1));
            }, 0);

            const totaisPorTitular = comprasAtivasMapeadas.reduce((acc, item) => {
              let nomeFormatado = item.original.titular ? item.original.titular.trim().toLowerCase() : 'desconhecido';
              nomeFormatado = nomeFormatado.charAt(0).toUpperCase() + nomeFormatado.slice(1);
              
              if (!acc[nomeFormatado]) acc[nomeFormatado] = 0;

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

            const faturasAtrasadas = [];
            const hoje = dataSimulada ? new Date(dataSimulada + 'T00:00:00') : new Date();
            hoje.setHours(0,0,0,0);
            
            if (dados.compras && dados.compras.length > 0) {
                let oldestDate = new Date();
                dados.compras.forEach(c => {
                    if (c.dataCompra) {
                        const d = new Date(c.dataCompra.split('T')[0]);
                        if (d < oldestDate) oldestDate = d;
                    }
                });
                
                let dataCheck = new Date(oldestDate.getFullYear(), oldestDate.getMonth(), 1);
                const dataLimite = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
                
                while (dataCheck < dataLimite) {
                    const checkVenc = new Date(dataCheck.getFullYear(), dataCheck.getMonth(), vencimentoCartao);
                    
                    if (hoje > checkVenc) {
                        const itensNesteMes = dados.compras.map(c => ({
                            original: c,
                            info: obterInfoParcela(c, dataCheck, fechamentoCartao)
                        })).filter(item => item.info.ativa);
                        
                        const temNaoPago = itensNesteMes.some(item => !item.info.isPago);
                        
                        if (temNaoPago) {
                            faturasAtrasadas.push({
                                nome: mesNomes[dataCheck.getMonth()],
                                ano: dataCheck.getFullYear(),
                                itens: itensNesteMes,
                                chave: `${dataCheck.getFullYear()}-${dataCheck.getMonth()}`
                            });
                        }
                    }
                    dataCheck.setMonth(dataCheck.getMonth() + 1);
                }
            }

            const faturasAtrasadasFiltradas = faturasAtrasadas.filter(f => f.chave !== `${dataFoco.getFullYear()}-${dataFoco.getMonth()}`);

            const dataVenc = new Date(dataFoco.getFullYear(), dataFoco.getMonth(), vencimentoCartao);
            const dataFech = new Date(dataFoco.getFullYear(), dataFoco.getMonth(), fechamentoCartao);
            
            const strMes = mesNomes[dataFoco.getMonth()];

            let statusFatura = 'ABERTA';
            let corStatus = 'text-emerald-600 bg-emerald-50 border-emerald-200';

            if (comprasAtivasMapeadas.length === 0) {
                statusFatura = 'VAZIA';
                corStatus = 'text-slate-400 bg-slate-50 border-slate-200';
            } else if (!temComprasPendentesNaTabela) {
                statusFatura = 'PAGA';
                corStatus = 'text-indigo-600 bg-indigo-50 border-indigo-200';
            } else if (hoje > dataVenc) {
                statusFatura = 'ATRASADA';
                corStatus = 'text-rose-600 bg-rose-50 border-rose-200 font-black shadow-sm';
            } else if (hoje >= dataFech) {
                statusFatura = 'PENDENTE';
                corStatus = 'text-amber-600 bg-amber-50 border-amber-200';
            }

            return (
              <div key={tituloCartao} className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative" style={{ borderLeft: `6px solid ${dados.cor}`, height: '500px' }}>
                
                {faturasAtrasadasFiltradas.length > 0 && (
                    <div className="flex flex-col w-full">
                        {faturasAtrasadasFiltradas.map(fat => (
                            <div key={fat.chave} className="bg-rose-500 text-white px-5 py-2.5 flex justify-between items-center text-[10px] font-black uppercase tracking-wider shrink-0">
                                <span className="flex items-center gap-2">
                                    <IconAlert /> FATURA DE {fat.nome} / {fat.ano} ATRASADA
                                </span>
                                <button 
                                    onClick={() => pagarFaturaPassada(fat.itens)}
                                    className="bg-white text-rose-600 px-3 py-1 rounded shadow-sm hover:bg-rose-50 transition-colors font-black"
                                >
                                    PAGAR
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="px-5 py-4 flex flex-row items-start justify-between border-b border-slate-100 gap-4 shrink-0 bg-white z-20">
                  <div className="flex flex-col gap-2 min-w-[150px]">
                    <div>
                      <h4 className="text-lg font-bold flex items-center gap-2">
                        <span className="text-slate-300 opacity-60"><IconCard /></span>
                        <span style={{ color: dados.cor }}>{nomeDoBanco}</span>
                        {numFinal && <span className="text-slate-500 font-medium text-sm">{numFinal}</span>}
                      </h4>
                      <p className="text-[10px] font-bold mt-1 tracking-wide text-slate-400 uppercase">
                        FECHA {dados.diaFechamento} {strMes} • VENCE {dados.diaPagamento} {strMes}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block leading-tight">
                          Fatura {strMes}
                        </span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${corStatus}`}>
                          {statusFatura}
                        </span>
                      </div>
                      <span className="text-xl font-black text-slate-800 leading-tight">R$ {totalFaturaMes.toFixed(2)}</span>
                    </div>
                    
                    <div className="h-7 mt-1 flex items-center">
                      {temComprasPendentesNaTabela ? (
                        pagamentoEmConfirmacao === dados.cartaoId ? (
                          <div className="flex gap-1 bg-emerald-50 p-0.5 rounded border border-emerald-200 animate-fade-in w-fit shadow-sm">
                            <button onClick={() => confirmarPagamentoLote(dados.cartaoId, comprasAtivasMapeadas, filtroAtivo)} className="text-emerald-700 hover:bg-emerald-100 px-2 py-1 rounded text-[10px] font-black tracking-widest flex items-center gap-1 transition-colors">
                              <IconCheck /> SIM
                            </button>
                            <button onClick={() => setPagamentoEmConfirmacao(null)} className="text-rose-600 hover:bg-rose-100 px-2 py-1 rounded text-[10px] font-black tracking-widest flex items-center gap-1 transition-colors">
                              <IconX /> NÃO
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setPagamentoEmConfirmacao(dados.cartaoId)} className="text-[9px] font-black tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-1.5 rounded hover:bg-emerald-100 transition-colors shadow-sm w-fit flex items-center gap-1">
                            <IconCheck /> {filtroAtivo ? `PAGAR ${filtroAtivo.toUpperCase()}` : 'PAGAR TUDO'}
                          </button>
                        )
                      ) : temComprasPagasNaTabela ? (
                        pendenteEmConfirmacao === dados.cartaoId ? (
                          <div className="flex gap-1 bg-amber-50 p-0.5 rounded border border-amber-200 animate-fade-in w-fit shadow-sm">
                            <button onClick={() => confirmarPendenteLote(dados.cartaoId, comprasAtivasMapeadas, filtroAtivo)} className="text-amber-700 hover:bg-amber-100 px-2 py-1 rounded text-[10px] font-black tracking-widest flex items-center gap-1 transition-colors">
                              <IconCheck /> SIM
                            </button>
                            <button onClick={() => setPendenteEmConfirmacao(null)} className="text-rose-600 hover:bg-rose-100 px-2 py-1 rounded text-[10px] font-black tracking-widest flex items-center gap-1 transition-colors">
                              <IconX /> NÃO
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setPendenteEmConfirmacao(dados.cartaoId)} className="text-[9px] font-black tracking-widest bg-amber-50 text-amber-600 border border-amber-200 px-2 py-1.5 rounded hover:bg-amber-100 transition-colors shadow-sm w-fit flex items-center gap-1">
                            <IconPencil /> {filtroAtivo ? `VOLTAR ${filtroAtivo.toUpperCase()}` : 'TUDO PENDENTE'}
                          </button>
                        )
                      ) : null}
                    </div>
                  </div>
                  
                  {/* ÁREA DOS TITULARES MAIS LARGA (2 COLUNAS DE CARTÕES) */}
                  <div className="flex-1 border-l border-slate-100/50 pl-4">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(totaisPorTitular).map(([nome, valor]) => {
                        const isSelecionado = filtroAtivo === nome;
                        return (
                          <div 
                            key={nome} 
                            onClick={() => toggleFiltro(nome)}
                            className={`flex justify-between items-center px-3 py-2 rounded-lg border shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 ${
                              isSelecionado ? '' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                            style={isSelecionado ? { backgroundColor: dados.cor, borderColor: dados.cor } : {}}
                            title={isSelecionado ? "Clique para limpar o filtro" : `Clique para ver apenas os gastos de ${nome}`}
                          >
                            <span className={`text-[10px] font-bold uppercase truncate mr-2 ${isSelecionado ? 'text-white opacity-90' : 'text-slate-600'}`}>{nome}</span>
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
                      cartaoEmExclusao === dados.cartaoId ? (
                        <div className="flex flex-col items-center gap-1.5 bg-rose-50 p-1.5 rounded border border-rose-200 animate-fade-in shadow-sm">
                          <span className="text-[10px] font-bold text-rose-600 uppercase text-center leading-tight">Excluir?</span>
                          <div className="flex gap-1.5">
                            <button onClick={() => { excluirCartao(dados.cartaoId); setCartaoEmExclusao(null); }} className="bg-rose-600 text-white p-1 rounded hover:bg-rose-700 transition-colors" title="Sim"><IconCheck /></button>
                            <button onClick={() => setCartaoEmExclusao(null)} className="bg-slate-200 text-slate-600 p-1 rounded hover:bg-slate-300 transition-colors" title="Não"><IconX /></button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setCartaoEmExclusao(dados.cartaoId)} className="text-slate-300 hover:text-rose-500 transition-colors" title="Excluir Cartão"><IconX /></button>
                      )
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
                                {compraEmExclusao === item.original.id ? (
                                  <div className="flex justify-center items-center gap-1 animate-fade-in bg-rose-50 p-1 rounded border border-rose-200">
                                    <button onClick={() => { excluirCompra(item.original.id); setCompraEmExclusao(null); }} className="text-rose-600 hover:bg-rose-200 p-1 rounded transition-colors" title="Confirmar"><IconCheck /></button>
                                    <button onClick={() => setCompraEmExclusao(null)} className="text-slate-500 hover:bg-slate-200 p-1 rounded transition-colors" title="Cancelar"><IconX /></button>
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center space-x-2 opacity-80 hover:opacity-100">
                                    <button onClick={() => iniciarEdicao(item.original)} className="text-indigo-500 hover:text-indigo-700"><IconPencil /></button>
                                    <button onClick={() => setCompraEmExclusao(item.original.id)} className="text-rose-500 hover:text-rose-700"><IconTrash /></button>
                                  </div>
                                )}
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