import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:8080/api';

export function useFinancas() {
  const [comprasCartao, setComprasCartao] = useState([]);
  const [cartoes, setCartoes] = useState([]);
  const [comprasPorCartao, setComprasPorCartao] = useState({});

  // Adiciona o Token mágico a todas as requisições!
  const getHeaders = () => {
    const token = localStorage.getItem('upfinancas_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    };
  };

  const carregarDados = useCallback(async () => {
    const token = localStorage.getItem('upfinancas_token');
    if (!token) return; // Se não houver token, não faz nada.

    try {
      const resCartoes = await fetch(`${API_URL}/cartoes`, { headers: getHeaders() });
      if (!resCartoes.ok) throw new Error("Erro de autorização");
      const dataCartoes = await resCartoes.json();
      setCartoes(dataCartoes);

      const resCompras = await fetch(`${API_URL}/compras`, { headers: getHeaders() });
      const dataCompras = await resCompras.json();
      setComprasCartao(dataCompras);

      const agrupado = {};
      dataCartoes.forEach(cartao => {
        const numFinal = cartao.numeroFinal ? ` - Final ${cartao.numeroFinal}` : '';
        const titulo = `${cartao.nomeBanco}${numFinal}`;
        agrupado[titulo] = {
          cartaoId: cartao.id,
          nomeBanco: cartao.nomeBanco,
          cor: cartao.corHexadecimal || '#8A05BE',
          diaFechamento: cartao.diaFechamento,
          diaPagamento: cartao.diaPagamento,
          compras: []
        };
      });

      dataCompras.forEach(compra => {
        if (compra.cartaoDeCredito) {
          const numFinal = compra.cartaoDeCredito.numeroFinal ? ` - Final ${compra.cartaoDeCredito.numeroFinal}` : '';
          const titulo = `${compra.cartaoDeCredito.nomeBanco}${numFinal}`;
          if (agrupado[titulo]) {
            agrupado[titulo].compras.push(compra);
          }
        }
      });

      setComprasPorCartao(agrupado);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
      // Opcional: Se der erro de autorização, forçar logout
      // if (error.message === "Erro de autorização") window.location.replace('/');
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const adicionarCartao = async (dados) => {
    try {
      const res = await fetch(`${API_URL}/cartoes`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(dados) });
      if (res.ok) { await carregarDados(); return { sucesso: true }; }
      return { sucesso: false, erro: 'Erro ao cadastrar' };
    } catch (error) { return { sucesso: false, erro: error.message }; }
  };

  const adicionarCompra = async (dados) => {
    try {
      const res = await fetch(`${API_URL}/compras`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(dados) });
      if (res.ok) { await carregarDados(); return true; }
      return false;
    } catch (error) { return false; }
  };

  const editarCompra = async (id, dados) => {
    try {
      const res = await fetch(`${API_URL}/compras/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(dados) });
      if (res.ok) { await carregarDados(); return true; }
      return false;
    } catch (error) { return false; }
  };

  const excluirCompra = async (id) => {
    try {
      const res = await fetch(`${API_URL}/compras/${id}`, { method: 'DELETE', headers: getHeaders() });
      if (res.ok) { await carregarDados(); return true; }
      return false;
    } catch (error) { return false; }
  };

  const excluirCartao = async (id) => {
    try {
      const res = await fetch(`${API_URL}/cartoes/${id}`, { method: 'DELETE', headers: getHeaders() });
      if (res.ok) { await carregarDados(); return true; }
      return false;
    } catch (error) { return false; }
  };

  return { comprasCartao, cartoes, comprasPorCartao, carregarDados, adicionarCartao, adicionarCompra, editarCompra, excluirCompra, excluirCartao };
}