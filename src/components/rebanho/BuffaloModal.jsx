"use client";

import React, { useEffect, useState, useCallback } from "react";

export default function BuffaloModal({
  open,
  buffalo,
  onClose,
  getStatusColor,
  getDadosZootecnicos,
  getDadosSanitarios,
  getSexIcon,
  buffalosMock = [],
}) {
  const [activeTab, setActiveTab] = useState("info");

  // Fechar no ESC
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  // Resetar para a aba inicial ao abrir/trocar o animal
  useEffect(() => {
    if (open) setActiveTab("info");
  }, [open, buffalo]);

  const stop = useCallback((e) => e.stopPropagation(), []);

  if (!open || !buffalo) return null;

  return (
    <div
      className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={stop}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {buffalo.nome}
            </h2>
            <p className="text-gray-600">Tag: {buffalo.tag}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-gray-200">
          {[
            { id: "info", label: "Informações Gerais" },
            { id: "zootecnicos", label: "Dados Zootécnicos" },
            { id: "sanitarios", label: "Dados Sanitários" },
            { id: "genealogia", label: "Árvore Genealógica" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-[#CE7D0A] border-b-2 border-[#CE7D0A] bg-[#FFCF78]/10"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* INFO */}
          {activeTab === "info" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Dados Básicos
                  </h3>
                  <div className="space-y-3">
                    <Row label="Nome" value={buffalo.nome} />
                    <Row label="Tag" value={buffalo.tag} />
                    <Row label="Sexo" value={buffalo.sexo} />
                    <Row label="Raça" value={buffalo.raca} />
                    <Row label="Maturidade" value={buffalo.maturidade} />
                    <Row label="Peso Atual" value={`${buffalo.peso} kg`} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Informações Adicionais
                  </h3>
                  <div className="space-y-3">
                    <Row label="Data de Nascimento" value={buffalo.nascimento} />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          buffalo.status
                        )}`}
                      >
                        {buffalo.status}
                      </span>
                    </div>
                    <Row label="Última Atualização" value={buffalo.ultimaAtualizacao} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ZOOTÉCNICOS */}
          {activeTab === "zootecnicos" && (
            <div className="space-y-6">
              {(() => {
                const dadosZoot = getDadosZootecnicos(buffalo);

                return (
                  <>
                    {dadosZoot.producaoLeite && (
                      <Section title="Produção de Leite">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Stat
                            value={dadosZoot.producaoLeite.producaoDiaria}
                            label="Produção Diária"
                          />
                          <Stat
                            value={dadosZoot.producaoLeite.producaoMensal}
                            label="Produção Mensal"
                          />
                          <Stat value={dadosZoot.producaoLeite.gordura} label="% Gordura" />
                          <Stat value={dadosZoot.producaoLeite.proteina} label="% Proteína" />
                        </div>
                      </Section>
                    )}

                    <Section title="Dados Reprodutivos">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Row label="Último Cio" value={dadosZoot.reproducao.ultimoCio} />
                          <Row label="Gestante" value={dadosZoot.reproducao.gestante} />
                        </div>
                        <div className="space-y-3">
                          <Row label="Último Parto" value={dadosZoot.reproducao.ultimoParto} />
                          <Row label="Número de Partos" value={dadosZoot.reproducao.numeroPartos} />
                        </div>
                      </div>
                    </Section>

                    <Section title="Dados de Crescimento">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Stat value={dadosZoot.crescimento.pesoNascimento} label="Peso Nascimento" />
                        <Stat value={dadosZoot.crescimento.ganhoPesoDiario} label="Ganho Peso/Dia" />
                        <Stat value={dadosZoot.crescimento.alturaGarupa} label="Altura Garupa" />
                        <Stat value={dadosZoot.crescimento.condicaoCorporal} label="Condição Corporal" />
                      </div>
                    </Section>
                  </>
                );
              })()}
            </div>
          )}

          {/* SANITÁRIOS */}
          {activeTab === "sanitarios" && (
            <div className="space-y-6">
              {(() => {
                const dadosSanit = getDadosSanitarios(buffalo);

                return (
                  <>
                    <Section title="Histórico de Vacinação">
                      <Table
                        head={["Vacina", "Última Aplicação", "Próxima Dose", "Status"]}
                        rows={dadosSanit.vacinacao.map((v) => [
                          <strong key="n">{v.vacina}</strong>,
                          v.data,
                          v.proxima,
                          <Badge key="s" color="green">{v.status}</Badge>,
                        ])}
                      />
                    </Section>

                    <Section title="Controle de Vermifugação">
                      <Table
                        head={["Produto", "Última Aplicação", "Próxima Dose", "Status"]}
                        rows={dadosSanit.vermifugacao.map((v) => [
                          <strong key="p">{v.produto}</strong>,
                          v.data,
                          v.proxima,
                          <Badge key="s" color={v.status === "Em dia" ? "green" : "red"}>
                            {v.status}
                          </Badge>,
                        ])}
                      />
                    </Section>

                    <Section title="Histórico de Exames">
                      <Table
                        head={["Exame", "Data", "Resultado", "Status"]}
                        rows={dadosSanit.exames.map((e) => [
                          <strong key="e">{e.exame}</strong>,
                          e.data,
                          e.resultado,
                          <Badge key="s" color="green">{e.status}</Badge>,
                        ])}
                      />
                    </Section>

                    {dadosSanit.tratamentos.length > 0 && (
                      <Section title="Tratamentos em Andamento">
                        <Table
                          head={["Tratamento", "Início", "Fim", "Status"]}
                          rows={dadosSanit.tratamentos.map((t) => [
                            <strong key="t">{t.tratamento}</strong>,
                            t.inicio,
                            t.fim,
                            <Badge key="s" color="yellow">{t.status}</Badge>,
                          ])}
                        />
                      </Section>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* GENEALOGIA */}
          {activeTab === "genealogia" && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
                  Árvore Genealógica
                </h3>

                <div className="flex flex-col items-center space-y-8">
                  {/* Avós */}
                  <div className="grid grid-cols-2 gap-16 w-full max-w-2xl">
                    <Grandparents
                      title="Avós Paternos"
                      male="Touro Benedito Sr."
                      female="Vaca Benedita"
                    />
                    <Grandparents
                      title="Avós Maternos"
                      male="Touro Francisco"
                      female="Vaca Francisca Sr."
                    />
                  </div>

                  <div className="w-px h-8 bg-gray-300" />

                  {/* Pais */}
                  <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                    <ParentCard
                      title="Pai"
                      name={buffalo.pai}
                      tag={`${getSexIcon(buffalo.sexo)} ${buffalo.raca}`}
                      color="blue"
                    />
                    <ParentCard
                      title="Mãe"
                      name={buffalo.mae}
                      tag={`♀ ${buffalo.raca}`}
                      color="pink"
                    />
                  </div>

                  <div className="w-px h-8 bg-gray-300" />

                  {/* Atual */}
                  <div className="bg-[#FFCF78] p-6 rounded-lg text-center border-2 border-[#CE7D0A]">
                    <p className="font-bold text-gray-800 text-lg">
                      {buffalo.nome}
                    </p>
                    <p className="text-sm text-gray-600">{buffalo.tag}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getSexIcon(buffalo.sexo)} {buffalo.raca} - {buffalo.maturidade}
                    </p>
                    <p className="text-xs text-gray-500">
                      Nascimento: {buffalo.nascimento}
                    </p>
                  </div>

                  {/* Descendentes */}
                  {(buffalo.maturidade === "Vaca" || buffalo.maturidade === "Touro") && (
                    <>
                      <div className="w-px h-8 bg-gray-300" />
                      <div className="text-center">
                        <h4 className="text-sm font-semibold text-gray-600 mb-4">
                          Descendentes
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {buffalosMock
                            .filter((b) => b.pai === buffalo.nome || b.mae === buffalo.nome)
                            .slice(0, 3)
                            .map((d, i) => (
                              <div key={i} className="bg-gray-100 p-3 rounded text-center">
                                <p className="font-medium text-sm">{d.nome}</p>
                                <p className="text-xs text-gray-600">{d.tag}</p>
                                <p className="text-xs text-gray-500">
                                  {getSexIcon(d.sexo)} {d.maturidade}
                                </p>
                              </div>
                            ))}

                          {buffalosMock.filter((b) => b.pai === buffalo.nome || b.mae === buffalo.nome).length === 0 && (
                            <div className="col-span-3 text-gray-500 text-sm">
                              Nenhum descendente registrado
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ———— Subcomponentes simples ———— */

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-[#CE7D0A]">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

function Table({ head = [], rows = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {head.map((h, i) => (
              <th key={i} className="text-left py-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cols, r) => (
            <tr key={r} className="border-b">
              {cols.map((c, i) => (
                <td key={i} className="py-2">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ children, color = "green" }) {
  const map = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
  };
  return <span className={`px-2 py-1 rounded-full text-xs ${map[color] || map.green}`}>{children}</span>;
}

function Grandparents({ title, male, female }) {
  return (
    <div className="text-center">
      <h4 className="text-sm font-semibold text-gray-600 mb-2">{title}</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-blue-100 p-2 rounded text-xs">
          <p className="font-medium">Avô</p>
          <p className="text-gray-600">{male}</p>
        </div>
        <div className="bg-pink-100 p-2 rounded text-xs">
          <p className="font-medium">Avó</p>
          <p className="text-gray-600">{female}</p>
        </div>
      </div>
    </div>
  );
}

function ParentCard({ title, name, tag, color = "blue" }) {
  const bg = color === "pink" ? "bg-pink-200" : "bg-blue-200";
  return (
    <div className={`${bg} p-4 rounded-lg text-center`}>
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-600">{name}</p>
      <p className="text-xs text-gray-500 mt-1">{tag}</p>
    </div>
  );
}
