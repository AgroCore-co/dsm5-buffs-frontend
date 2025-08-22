"use client";

import React from "react";

export default function GenealogyTree({ current, parents, grandparents, greatGrandparents }) {
  // ====== badge de risco
  const riskChip = (risk = "low") => {
    const map = {
      high: "border-red-400 bg-red-50",
      med: "border-amber-400 bg-amber-50",
      low: "border-emerald-400 bg-emerald-50",
    };
    const dot = { high: "bg-red-500", med: "bg-amber-500", low: "bg-emerald-500" };
    const txt = { high: "text-red-800", med: "text-amber-800", low: "text-emerald-800" };
    return { box: map[risk] || map.low, dot: dot[risk] || dot.low, txt: txt[risk] || txt.low };
  };

  // ====== Nó
  const Node = React.forwardRef(function Node(
    { title, subtitle, initials, role = "current", risk = "low" },
    ref
  ) {
    const styles = {
      current: "ring-2 ring-emerald-500 bg-emerald-50",
      parent: "ring-2 ring-amber-500 bg-white",
      grand: "ring-2 ring-teal-500 bg-white",
    }[role];

    const chip = riskChip(risk);

    return (
      <div
        ref={ref}
        className={`relative flex flex-col items-center justify-center text-center rounded-xl p-3 shadow-md ${styles}`}
      >
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full ring-2 ring-white" aria-hidden>
          <span className={`absolute inset-0 rounded-full ${chip.dot}`} />
        </div>
        <div
          className={`h-10 w-10 rounded-full grid place-items-center text-white font-bold mb-2
          ${role === "current" ? "bg-emerald-600" : role === "parent" ? "bg-amber-600" : "bg-teal-600"}`}
        >
          {initials}
        </div>
        <div className="text-[11px] font-semibold text-gray-900 leading-tight max-w-[160px] truncate">
          {title}
        </div>
        {subtitle && (
          <div className="text-[10px] text-gray-500 max-w-[160px] truncate">{subtitle}</div>
        )}
        <span className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[9px] border ${chip.box} ${chip.txt}`}>
          {risk === "high" ? "Alto" : risk === "med" ? "Médio" : "Baixo"}
        </span>
      </div>
    );
  });

  // iniciais
  const ini = (name = "") =>
    name.split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("") || "—";

  // refs + linhas
  const containerRef = React.useRef(null);
  const refCur = React.useRef(null);
  const refPai = React.useRef(null);
  const refMae = React.useRef(null);
  const refAP = React.useRef(null);
  const refAPF = React.useRef(null);
  const refAM = React.useRef(null);
  const refAMF = React.useRef(null);
  const refBP1 = React.useRef(null);
  const refBP2 = React.useRef(null);
  const refBM1 = React.useRef(null);
  const refBM2 = React.useRef(null);

  const [lines, setLines] = React.useState([]);

  const addLine = (aRef, bRef, acc) => {
    const cont = containerRef.current;
    if (!cont || !aRef?.current || !bRef?.current) return;
    const c = cont.getBoundingClientRect();
    const a = aRef.current.getBoundingClientRect();
    const b = bRef.current.getBoundingClientRect();
    acc.push({
      x1: a.left - c.left + a.width / 2,
      y1: a.bottom - c.top,
      x2: b.left - c.left + b.width / 2,
      y2: b.top - c.top,
    });
  };

  React.useLayoutEffect(() => {
    const calc = () => {
      const arr = [];
      addLine(refPai, refCur, arr);
      addLine(refMae, refCur, arr);
      addLine(refAP, refPai, arr);
      addLine(refAPF, refPai, arr);
      addLine(refAM, refMae, arr);
      addLine(refAMF, refMae, arr);
      addLine(refBP1, refAP, arr);
      addLine(refBP2, refAPF, arr);
      addLine(refBM1, refAM, arr);
      addLine(refBM2, refAMF, arr);
      setLines(arr);
    };
    calc();
    const obs = new ResizeObserver(calc);
    if (containerRef.current) obs.observe(containerRef.current);
    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("resize", calc);
      obs.disconnect();
    };
  }, [current, parents, grandparents, greatGrandparents]);

  return (
    <div className="relative">
      {/* Fundo ocupa o tamanho real */}
      <div ref={containerRef} className="relative rounded-xl overflow-hidden bg-gradient-to-b from-emerald-100 to-emerald-300 p-6">
        {/* Linhas em cima do fundo */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {lines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="rgba(31,41,55,.45)" strokeWidth="2" />
          ))}
        </svg>

        {/* Pirâmide */}
        <div className="relative mx-auto max-w-[1100px]">
          {/* Atual */}
          <div className="flex justify-center mb-8">
            <Node
              ref={refCur}
              role="current"
              title={current?.nome || "—"}
              subtitle={`${current?.raca || "—"} • ${current?.maturidade || "—"}`}
              initials={ini(current?.nome)}
            />
          </div>

          {/* Pais */}
          <div className="flex justify-center gap-12 mb-10">
            <Node
              ref={refPai}
              role="parent"
              title={parents?.pai?.nome || "—"}
              subtitle={`${parents?.pai?.raca || "—"} • ${parents?.pai?.prod || "—"}`}
              initials={ini(parents?.pai?.nome)}
            />
            <Node
              ref={refMae}
              role="parent"
              title={parents?.mae?.nome || "—"}
              subtitle={`${parents?.mae?.raca || "—"} • ${parents?.mae?.prod || "—"}`}
              initials={ini(parents?.mae?.nome)}
            />
          </div>

          {/* Avós */}
          <div className="flex justify-center gap-8 mb-10 flex-wrap">
            <Node ref={refAP} role="parent" title={grandparents?.avoPai?.nome || "—"} subtitle={`${grandparents?.avoPai?.raca || "—"} • ${grandparents?.avoPai?.prod || "—"}`} initials={ini(grandparents?.avoPai?.nome)} />
            <Node ref={refAPF} role="parent" title={grandparents?.avoPaiF?.nome || "—"} subtitle={`${grandparents?.avoPaiF?.raca || "—"} • ${grandparents?.avoPaiF?.prod || "—"}`} initials={ini(grandparents?.avoPaiF?.nome)} />
            <Node ref={refAM} role="parent" title={grandparents?.avoMae?.nome || "—"} subtitle={`${grandparents?.avoMae?.raca || "—"} • ${grandparents?.avoMae?.prod || "—"}`} initials={ini(grandparents?.avoMae?.nome)} />
            <Node ref={refAMF} role="parent" title={grandparents?.avoMaeF?.nome || "—"} subtitle={`${grandparents?.avoMaeF?.raca || "—"} • ${grandparents?.avoMaeF?.prod || "—"}`} initials={ini(grandparents?.avoMaeF?.nome)} />
          </div>

          {/* Bisavós */}
          <div className="flex justify-center gap-6 flex-wrap">
            <Node ref={refBP1} role="grand" title={greatGrandparents?.bisavoP1?.nome || "—"} subtitle={greatGrandparents?.bisavoP1?.raca} initials={ini(greatGrandparents?.bisavoP1?.nome)} />
            <Node ref={refBP2} role="grand" title={greatGrandparents?.bisavoP2?.nome || "—"} subtitle={greatGrandparents?.bisavoP2?.raca} initials={ini(greatGrandparents?.bisavoP2?.nome)} />
            <Node ref={refBM1} role="grand" title={greatGrandparents?.bisavoM1?.nome || "—"} subtitle={greatGrandparents?.bisavoM1?.raca} initials={ini(greatGrandparents?.bisavoM1?.nome)} />
            <Node ref={refBM2} role="grand" title={greatGrandparents?.bisavoM2?.nome || "—"} subtitle={greatGrandparents?.bisavoM2?.raca} initials={ini(greatGrandparents?.bisavoM2?.nome)} />
          </div>
        </div>
      </div>

      {/* legenda */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-700">
        <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-emerald-600" /> atual</span>
        <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-amber-600" /> pais/avós</span>
        <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-teal-600" /> bisavós</span>
      </div>
    </div>
  );
}
