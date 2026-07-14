import { useState, useEffect, useMemo } from 'react';

const API_URL = 'http://localhost:5174/api';

export function useFinancas() {
  const [comprasCartao, setComprasCartao] = useState([]);
  const [cartoes, setCartoes] = useState([]);
  // Mock para as futuras áreas
  const [gastosFixos, setGastosFixos] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);

  const buscarDados = async () => {
    try {
      const resCartoes = await fetch(`${API_URL}/cartoes`);
      if (resCartoes.ok) setCartoes(await resCartoes.json());

      const resCompras = await fetch(`${API_URL}/compras`);
      if (resCompras.ok) setComprasCartao(await resCompras.json());
    } catch (erro) {
      console.error("Erro ao buscar dados da API:", erro);
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  const adicionarCartao = async (novoCartao) => {
  try {
    const res = await fetch(`${API_URL}/cartoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoCartao)
    });
    
    if (res.ok) { 
      buscarDados(); 
      return { sucesso: true }; 
    } else {
      // Lê a mensagem de erro enviada pelo return BadRequest(...) do C#
      const mensagemErro = await res.text();
      return { sucesso: false, erro: mensagemErro };
    }
  } catch (erro) { 
    return { sucesso: false, erro: "Falha de comunicação com o servidor." }; 
  }
};

  const excluirCartao = async (id) => {
    try {
      const res = await fetch(`${API_URL}/cartoes/${id}`, { method: 'DELETE' });
      if (res.ok) { buscarDados(); return true; }
      return false;
    } catch (erro) { return false; }
  };

  const adicionarCompra = async (novaCompra) => {
    try {
      const res = await fetch(`${API_URL}/compras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titular: novaCompra.titular,
          descricao: novaCompra.descricao,
          valorTotal: parseFloat(novaCompra.valorTotal),
          parcelaAtual: parseInt(novaCompra.parcelaAtual),
          quantidadeParcelas: parseInt(novaCompra.quantidadeParcelas),
          dataCompra: novaCompra.dataCompra,
          cartaoDeCreditoId: parseInt(novaCompra.cartaoDeCreditoId),
          foiPago: novaCompra.foiPago || false,
          categoria: novaCompra.categoria || 'Outros'
        })
      });
      if (res.ok) { buscarDados(); return true; }
      return false;
    } catch (erro) { return false; }
  };

  const editarCompra = async (id, dadosAtualizados) => {
    try {
      const res = await fetch(`${API_URL}/compras/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
      });
      if (res.ok) { buscarDados(); return true; }
      return false;
    } catch (erro) { return false; }
  };

  const excluirCompra = async (id) => {
    try {
      const res = await fetch(`${API_URL}/compras/${id}`, { method: 'DELETE' });
      if (res.ok) { buscarDados(); return true; }
      return false;
    } catch (erro) { return false; }
  };

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
            diaFechamento: cartao.diaFechamento, 
            diaPagamento: cartao.diaPagamento,   
            compras: [] 
        };
      }
      acc[tituloCartao].compras.push(compra);
      return acc;
    }, {});
  }, [comprasCartao]);

  return { comprasCartao, comprasPorCartao, cartoes, gastosFixos, emprestimos, adicionarCartao, adicionarCompra, editarCompra, excluirCompra, excluirCartao };
}