"use client";

import React from "react";

/**
 * props esperadas:
 * - records: Array<{ id, grupo, sexo, raca, maturidade, doencas: Array<{nome}> }>
 *   Cada `record` representa um animal (ou prontuário) com suas categorias e doenças registradas.
 *
 * Exemplo mínimo de record:
 * {
 *   id: "A-001",
 *   grupo: "Lote 1",
 *   sexo: "Fêmea",
 *   raca: "Murrah",
 *   maturidade: "Adulto",
 *   doencas: [{ nome: "Mastite" }, { nome: "Febre aftosa" }]
 * }
 */

export default function HerdHealthAnalysis({ records = [] }) {
  // ====== filtros ======
  const [fGrupo, setFGrupo] = React.useState("Todos");
  const [fSexo, setFSexo] = React.useState("Todos");
  const [fRaca, setFRaca] = React.useState("Todos");
  const [fMaturidade, setFMaturidade] = React.useState("Todos");

  // valores únicos para selects
  const grupos = React.useMemo(
    () => ["Todos", ...Array.from(new Set(records.map((r) => r.grupo))).filter(Boolean)],
    [records]
  );
  const sexos = React.useMemo(
    () => ["Todos", ...Array.from(new Set(records.map((r) => r.sexo))).filter(Boolean)],
    [records]
  );
  const racas = React.useMemo(
    () => ["Todos", ...Array.from(new Set(records.map((r) => r.raca))).filter(Boolean)],
    [records]
  );
  const maturidades = React.useMemo(
    () => ["Todos", ...Array.from(new Set(records.map((r) => r.maturidade))).filter(Boolean)],
    [records]
  );

  // aplica filtros
  const filtrados = React.useMemo(() => {
    return records.filter((r) => {
      if (fGrupo !== "Todos" && r.grupo !== fGrupo) return false;
      if (fSexo !== "Todos" && r.sexo !== fSexo) return false;
      if (fRaca !== "Todos" && r.raca !== fRaca) return false;
      if (fMaturidade !== "Todos" && r.maturidade !== fMaturidade) return false;
      return true;
    });
  }, [records, fGrupo, fSexo, fRaca, fMaturidade]);

  // ====== agregações ======

  // Doenças recorrentes (contagem por nome / percentual no conjunto filtrado)
  const doencasRecorrentes = React.useMemo(() => {
    const totalAnimais = filtrados.length || 1;
    const map = new Map(); // nome -> count de animais com a doença

    for (const r of filtrados) {
      const nomes = Array.from(new Set((r.doencas || []).map((d) => d.nome).filter(Boolean)));
      for (const n of nomes) map.set(n, (map.get(n) || 0) + 1);
    }

    const arr = Array.from(map.entries())
      .map(([nome, count]) => ({
        nome,
        percentual: (count / totalAnimais) * 100,
        count,
      }))
      .sort((a, b) => b.percentual - a.percentual)
      .slice(0, 8); // top 8

    return arr;
  }, [filtrados]);

  // Doenças por nível de maturidade (percentual por categoria dentro do filtro atual, fatiando por maturidade)
  const doencasPorMaturidade = React.useMemo(() => {
    // Se já filtrou por maturidade específica, mostrar breakdown simples (100% daquela fatia)
    if (fMaturidade !== "Todos") {
      const total = filtrados.length || 1;
      return [{ categoria: fMaturidade, percentual: 100, total }];
    }

    const bucket = new Map(); // maturidade -> { animais: countComPeloMenosUmaDoenca, total: totalAnimaisNaFaixa }
    const byMat = new Map();   // maturidade -> Set(ids com alguma doença)

    for (const r of filtrados) {
      const key = r.maturidade || "—";
      if (!bucket.has(key)) bucket.set(key, { total: 0 });
      bucket.get(key).total += 1;

      const temDoenca = (r.doencas || []).length > 0;
      if (temDoenca) {
        if (!byMat.has(key)) byMat.set(key, new Set());
        byMat.get(key).add(r.id);
      }
    }

    const arr = Array.from(bucket.entries()).map(([categoria, { total }]) => {
      const comDoenca = byMat.get(categoria)?.size || 0;
      const percentual = total ? (comDoenca / total) * 100 : 0;
      return { categoria, percentual, total, comDoenca };
    });

    return arr.sort((a, b) => b.percentual - a.percentual);
  }, [filtrados, fMaturidade]);

  // ====== UI ======
  return (
    <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-800">
          Análise Geral de Saúde do Rebanho
        </h2>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          <Select label="Grupo" value={fGrupo} onChange={setFGrupo} options={grupos} />
          <Select label="Sexo" value={fSexo} onChange={setFSexo} options={sexos} />
          <Select label="Raça" value={fRaca} onChange={setFRaca} options={racas} />
          <Select label="Maturidade" value={fMaturidade} onChange={setFMaturidade} options={maturidades} />
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Doenças recorrentes */}
        <Card title="Doenças Recorrentes" subtitle="Doenças mais frequentes nos registros filtrados">
          <BarList
            data={doencasRecorrentes.map(d => ({
              label: d.nome,
              value: d.percentual,
              right: `${d.percentual.toFixed(1)}%`,
            }))}
            barClass="bg-[#FFCF78]"
          />
        </Card>

        {/* Doenças por nível de maturidade */}
        <Card title="Doenças por Nível de Maturidade" subtitle="Percentual de animais com alguma doença por faixa">
          <BarList
            data={doencasPorMaturidade.map(i => ({
              label: i.categoria,
              value: i.percentual,
              right: `${i.percentual.toFixed(1)}%`,
            }))}
            barClass="bg-[#CE7D0A]"
          />
        </Card>
      </div>
    </div>
  );
}

/* ---------- componentes auxiliares (inline) ---------- */

function Select({ label, value, onChange, options }) {
  return (
    <label className="text-sm text-gray-700 flex items-center gap-2">
      <span className="font-medium">{label}</span>
      <select
        className="border rounded-lg px-2 py-1.5 text-sm bg-white hover:bg-gray-50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((op) => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
    </label>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4 ring-1 ring-gray-100">
      <div className="text-2xl font-extrabold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-lg shadow border border-[#e0e0e0] p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-gray-600 mb-5">{subtitle}</p>}
      {children}
    </div>
  );
}

function BarList({ data, barClass }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-500">Sem dados para os filtros selecionados.</p>;
  }
  // normaliza widths entre 0–100
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex flex-col gap-4">
      {data.map((item, idx) => {
        const pct = Math.max(0, Math.min(100, (item.value / max) * 100));
        return (
          <div key={idx} className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-800">{item.label}</span>
              <span className="text-sm font-medium text-gray-800">{item.right}</span>
            </div>
            <div className="w-full h-6 bg-gray-100 rounded overflow-hidden">
              <div className={`h-full ${barClass} rounded`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
