export default function SecaoEmprestimos({ emprestimos }) {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-semibold text-slate-500">Controle de Amortização</h3>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-all">
          + Novo Empréstimo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {emprestimos.map(emp => (
          <div key={emp.id} className="p-6 border border-slate-200 rounded-2xl shadow-sm bg-white hover:shadow-md transition-shadow relative overflow-hidden">
            
            {/* Detalhe de cor na borda superior */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

            <div className="flex justify-between items-start mb-6 mt-2">
              <div>
                <h4 className="font-black text-slate-800 text-xl mb-1 flex items-center gap-2">🏦 {emp.descricao}</h4>
                <p className="text-slate-500 font-medium">Parcela: <span className="text-slate-800 font-bold">R$ {emp.valorParcela.toFixed(2)}</span></p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Valor Total</p>
                <p className="font-black text-indigo-600 text-2xl">R$ {emp.valorTotal.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Barra de Progresso */}
            <div className="w-full bg-slate-100 rounded-full h-3 mb-3 overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500" style={{ width: `${(emp.parcelasPagas / emp.totalParcelas) * 100}%` }}></div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-indigo-600">{((emp.parcelasPagas / emp.totalParcelas) * 100).toFixed(0)}% Pago</span>
              <span className="font-semibold text-slate-500">{emp.parcelasPagas} de {emp.totalParcelas} parcelas</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}