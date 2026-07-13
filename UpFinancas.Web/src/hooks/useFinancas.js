import { useState, useEffect, useMemo } from 'react';

export function useFinancas() {
  const [comprasCartao, setComprasCartao] = useState([]);
  const [cartoes, setCartoes] = useState([]); 
  
  const [gastosFixos] = useState([
    { id: 1, nome: 'Conta de Luz (Cosern)', valor: 220.00, status: 'Pendente' }
  ]);
  const [emprestimos] = useState([
    { id: 1, descricao: 'Empréstimo Principal', valorTotal: 5000, valorParcela: 450.00, parcelasPagas: 5, totalParcelas: 12 }
  ]);

  const API_URL = 'http://localhost:5174/api'; 

  const buscarDados = async () => {
    try {
      const [resCompras, resCartoes] = await Promise.all([
        fetch(`${API_URL}/compras`),
        fetch(`${API_URL}/cartoes`)
      ]);

      if (resCompras.ok) setComprasCartao(await resCompras.json());
      if (resCartoes.ok) setCartoes(await resCartoes.json());
    } catch (erro) {
      console.error("Erro de conexão:", erro);
    }
  };

  useEffect(() => { buscarDados(); }, []);

  // --- POSTs ---
  const adicionarCartao = async (novoCartao) => {
    try {
      const resposta = await fetch(`${API_URL}/cartoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoCartao)
      });
      if (resposta.ok) { buscarDados(); return true; }
      return false;
    } catch (erro) { return false; }
  };

 const adicionarCompra = async (novaCompra) => {
    try {
      const resposta = await fetch(`${API_URL}/compras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titular: novaCompra.titular,
          descricao: novaCompra.descricao,
          valorTotal: parseFloat(novaCompra.valorTotal),
          parcelaAtual: parseInt(novaCompra.parcelaAtual), // <--- NOVO CAMPO
          quantidadeParcelas: parseInt(novaCompra.quantidadeParcelas),
          dataCompra: novaCompra.dataCompra,
          cartaoDeCreditoId: parseInt(novaCompra.cartaoDeCreditoId)
        })
      });
      if (resposta.ok) {
        buscarDados(); 
        return true;
      }
      return false;
    } catch (erro) {
      console.error("Erro ao salvar compra:", erro);
      return false;
    }
  };

  // --- PUT (Edição) ---
  const editarCompra = async (id, dadosAtualizados) => {
    try {
      const resposta = await fetch(`${API_URL}/compras/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
      });
      if (resposta.ok) { buscarDados(); return true; }
      return false;
    } catch (erro) { return false; }
  };

  // --- DELETEs ---
  const excluirCompra = async (id) => {
    try {
      await fetch(`${API_URL}/compras/${id}`, { method: 'DELETE' });
      buscarDados(); 
    } catch (erro) { console.error("Erro ao excluir compra:", erro); }
  };

  const excluirCartao = async (id) => {
    try {
      await fetch(`${API_URL}/cartoes/${id}`, { method: 'DELETE' });
      buscarDados(); 
    } catch (erro) { console.error("Erro ao excluir cartão:", erro); }
  };

  // --- Agrupamento ---
  // Lógica de agrupamento ATUALIZADA
  const comprasPorCartao = useMemo(() => {
    return comprasCartao.reduce((acc, compra) => {
      const cartao = compra.cartaoDeCredito || {};
      const nomeBanco = cartao.nomeBanco || compra.banco || "Desconhecido";
      const numeroFinal = cartao.numeroFinal || "";
      const cor = cartao.corHexadecimal || compra.cor || "#64748b";
      const cartaoId = cartao.id || null;

      const tituloCartao = numeroFinal ? `${nomeBanco} - Final ${numeroFinal}` : nomeBanco;

      if (!acc[tituloCartao]) {
        acc[tituloCartao] = { 
            cartaoId: cartaoId, 
            cor: cor, 
            diaFechamento: cartao.diaFechamento, // <-- Novo
            diaPagamento: cartao.diaPagamento,   // <-- Novo
            compras: [] 
        };
      }
      acc[tituloCartao].compras.push(compra);
      return acc;
    }, {});
  }, [comprasCartao]);

  return { comprasPorCartao, cartoes, gastosFixos, emprestimos, adicionarCartao, adicionarCompra, editarCompra, excluirCompra, excluirCartao };
}
