import { useState } from 'react';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  // O correto é ter o /usuarios no final!
const baseUrl = 'http://localhost:8080/api/usuarios';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    const url = isLogin ? `${baseUrl}/login` : `${baseUrl}/registrar`;
    const payload = isLogin ? { email, senha } : { nome, email, senha };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Erro na autenticação');
      }
      
      const data = await res.json();
      
      if (isLogin) {
        onLogin(data.usuario, data.token); 
      } else {
        alert("Conta criada com sucesso! Por favor, faça login para entrar.");
        setIsLogin(true); // Volta para a tela de login
        setSenha(''); // Limpa a senha por segurança
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-slate-100 p-8 animate-fade-in">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md mb-4">U</div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">UpFinanças</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {isLogin ? 'Bem-vindo de volta!' : 'Crie a sua conta e controle tudo.'}
          </p>
        </div>

        {erro && (
          <div className="bg-rose-50 text-rose-600 text-sm font-bold p-3 rounded-lg text-center mb-6 border border-rose-100">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Como quer ser chamado?</label>
              <input required type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Bruna Raquel" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all" />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="bruna@exemplo.com" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Senha</label>
            <input required type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all" />
          </div>

          <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white font-black py-3.5 rounded-xl hover:bg-indigo-700 shadow-md transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Aguarde...' : (isLogin ? 'Acessar a minha conta' : 'Criar Conta e Começar')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button type="button" onClick={() => { setIsLogin(!isLogin); setErro(''); setSenha(''); }} className="text-sm font-bold text-indigo-500 hover:text-indigo-700 transition-colors">
            {isLogin ? 'Não tem conta? Criar uma agora.' : 'Já tem uma conta? Fazer Login.'}
          </button>
        </div>

      </div>
    </div>
  );
}