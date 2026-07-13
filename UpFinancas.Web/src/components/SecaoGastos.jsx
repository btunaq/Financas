export default function SecaoGastos({ gastosFixos }) {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-semibold text-slate-500">Despesas Fixas do Mês</h3>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-all">
          + Novo Gasto
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4 text-right">Valor</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {gastosFixos.map(gasto => (
              <tr key={gasto.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-700 text-base">{gasto.nome}</td>
                <td className="px-6 py-4 text-right font-bold text-slate-800 text-base">R$ {gasto.valor.toFixed(2)}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${gasto.status === 'Pago' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {gasto.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg transition-colors" title="Marcar como Pago">✔️</button>
                  <button className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors" title="Editar">✏️</button>
                  <button className="text-rose-600 bg-rose-50 hover:bg-rose-100 p-2 rounded-lg transition-colors" title="Excluir">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}