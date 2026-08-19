import { useState } from 'react';

export default function Perfil({ usuarioLogado, setUsuarioLogado, atualizarPerfil }) {
  const [email, setEmail] = useState(usuarioLogado?.email || '');
  const [novaSenha, setNovaSenha] = useState('');
  const [status, setStatus] = useState({ tipo: '', mensagem: '' });

  const handleSalvar = async (e) => {
    e.preventDefault();
    setStatus({ tipo: 'loading', mensagem: 'A guardar alterações...' });

    const resultado = await atualizarPerfil({ 
        email, 
        novaSenha: novaSenha.trim() === '' ? null : novaSenha 
    });

    if (resultado.sucesso) {
      setStatus({ tipo: 'sucesso', mensagem: 'Dados atualizados com sucesso!' });
      
      const userNovo = { ...usuarioLogado, email: resultado.user.email };
      setUsuarioLogado(userNovo);
      localStorage.setItem('upfinancas_user', JSON.stringify(userNovo));
      
      setNovaSenha('');
    } else {
      setStatus({ tipo: 'erro', mensagem: resultado.erro || 'Erro ao atualizar dados.' });
    }
  };

  return (
    <div className="animate-fade-in max-w-xl mx-auto mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        
        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-sm">
            {usuarioLogado?.nome ? usuarioLogado.nome.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">O teu Perfil</h2>
            <p className="text-slate-500 font-medium text-sm">Gere as tuas credenciais de acesso</p>
          </div>
        </div>

        {status.mensagem && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-bold border ${
            status.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
            status.tipo === 'loading' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 
            'bg-rose-50 text-rose-600 border-rose-200'
          }`}>
            {status.mensagem}
          </div>
        )}

        <form onSubmit={handleSalvar} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">E-mail de Acesso</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Nova Senha (opcional)</label>
            <input 
              type="password" 
              value={novaSenha} 
              onChange={e => setNovaSenha(e.target.value)} 
              placeholder="Deixa em branco para manter a senha atual"
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 placeholder-slate-300" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 shadow-md transition-all mt-4"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}