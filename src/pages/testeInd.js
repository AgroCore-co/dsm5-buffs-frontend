"use client";



export default function Producao() {
  return (
    <div className="w-full bg-[#f5f5f5] p-5 flex flex-col items-center gap-5 box-border">
      {/* Indicadores da Produção */}
      <div className="w-full max-w-[1200px] flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Controle de Produção
          </h1>
          <p className="text-gray-600">
            Monitoramento da Produção de Leite de Búfalas - 0 coletas registradas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
            <h2 className="text-sm font-medium text-gray-500">Total Produzido</h2>
            <p className="text-2xl font-bold text-gray-800">0 L</p>
            <p className="text-sm font-medium text-green-700">Produção acumulada</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
            <h2 className="text-sm font-medium text-gray-500">Total Retirado</h2>
            <p className="text-2xl font-bold text-gray-800">0 L</p>
            <p className="text-sm font-medium text-green-700">Volume comercializado</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
            <h2 className="text-sm font-medium text-gray-500">Taxa de Aprovação</h2>
            <p className="text-2xl font-bold text-gray-800">0%</p>
            <p className="text-sm font-medium text-green-700">Qualidade do produto</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
            <h2 className="text-sm font-medium text-gray-500">Volume Rejeitado</h2>
            <p className="text-2xl font-bold text-gray-800">0 L</p>
            <p className="text-sm font-medium text-red-600">Perdas registradas</p>
          </div>
        </div>
      </div>

      {/* Tabela de Coletas */}
      <div className="w-full max-w-[1200px] flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Registro de Coletas</h2>

        {/* Filtros */}
        <div className="flex gap-4 flex-wrap items-end">
          <div className="flex flex-col">
            <label className="font-semibold mb-1.5 text-gray-700 text-sm">
              Buscar por Empresa
            </label>
            <input
              type="text"
              className="py-2 px-3 border-2 border-[#D9DBDB] rounded-lg text-sm w-[300px] max-w-full"
              placeholder="Digite o nome da empresa"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1.5 text-gray-700 text-sm">
              Status
            </label>
            <select className="py-2 px-3 border-2 border-[#D9DBDB] rounded-lg text-sm text-gray-700 min-w-[150px]">
              <option>Todos os status</option>
              <option>Positivo</option>
              <option>Negativo</option>
            </select>
          </div>

          <button className="py-2 px-3.5 bg-[#28a745] border-2 border-[#28a745] rounded-lg cursor-pointer font-bold text-white hover:bg-[#218838] transition-colors">
            Registrar Coleta
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse min-w-[650px] bg-white rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-[#f0f0f0]">
              <tr>
                <th className="p-3 text-left font-medium text-gray-800 text-base">Data da Coleta</th>
                <th className="p-3 text-left font-medium text-gray-800 text-base">Empresa</th>
                <th className="p-3 text-left font-medium text-gray-800 text-base">Quantidade</th>
                <th className="p-3 text-left font-medium text-gray-800 text-base">Valor Pago</th>
                <th className="p-3 text-center font-medium text-gray-800 text-base">Status</th>
                <th className="p-3 text-center font-medium text-gray-800 text-base">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#fafafa]">
                <td className="p-3 text-gray-800 text-base">01/01/2025</td>
                <td className="p-3 text-gray-800 text-base">Empresa Teste</td>
                <td className="p-3 text-gray-800 text-base">1000 L</td>
                <td className="p-3 text-gray-800 text-base">R$ 2.000,00</td>
                <td className="p-3 text-center text-base">
                  <span className="px-2.5 py-1.5 rounded-full text-sm font-bold inline-block w-20 bg-green-200 text-green-800">
                    Aprovado
                  </span>
                </td>
                <td className="p-3 text-center text-base">
                  <div className="flex gap-2 justify-center">
                    <button className="bg-[#FFCF78] text-black py-1 px-2 rounded-lg cursor-pointer text-sm font-medium hover:bg-[#f39c12] transition-colors">
                      Ver detalhes
                    </button>
                    <button className="bg-[#3b82f6] text-white py-1 px-2 rounded-lg cursor-pointer text-sm font-medium hover:bg-blue-700 transition-colors">
                      Editar
                    </button>
                    <button className="bg-[#ef4444] text-white py-1 px-2 rounded-lg cursor-pointer text-sm font-medium hover:bg-red-700 transition-colors">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Producao.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>;
// };
