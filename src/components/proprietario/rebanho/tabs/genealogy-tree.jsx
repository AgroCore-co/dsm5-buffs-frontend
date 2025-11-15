"use client"

import React from "react"

export default function GenealogyTree({ current, parents, grandparents, greatGrandparents, onNavigate }) {
  const riskChip = (risk = "low") => {
    const map = {
      high: "border-red-300 bg-red-50",
      med: "border-[#fca90f] bg-amber-50",
      low: "border-green-300 bg-green-50",
    }
    const dot = {
      high: "bg-[#e90000]",
      med: "bg-[#fca90f]",
      low: "bg-[#9dffbe]",
    }
    const txt = { high: "text-[#e90000]", med: "text-[#ce7d0a]", low: "text-green-700" }
    return { box: map[risk] || map.low, dot: dot[risk] || dot.low, txt: txt[risk] || txt.low }
  }

  const Node = React.forwardRef(function Node(
    { title, subtitle, initials, role = "current", risk = "low", onClick, id },
    ref,
  ) {
    const styles = {
      current:
        "ring-4 ring-[#ffcf78] bg-[#fff7ee] shadow-2xl hover:shadow-[0_20px_50px_rgba(252,169,15,0.3)]",
      parent:
        "ring-2 ring-[#f2b84d] bg-[#fff7ee] shadow-xl hover:shadow-[0_15px_40px_rgba(252,169,15,0.25)]",
      grand:
        "ring-2 ring-[#b0b0b0] bg-[#f8fcfa]  hover:shadow-[0_10px_30px_rgba(176,176,176,0.2)]",
    }[role]

    const avatarStyles = {
      current: "bg-[#fca90f] text-[#43310b] font-bold text-lg shadow-xl",
      parent: "bg-[#ffcf78] text-[#43310b] font-semibold text-base ",
      grand: "bg-[#b0b0b0] text-white font-semibold text-sm ",
    }[role]

    const chip = riskChip(risk)

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center text-center rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${styles} ${onClick ? "cursor-pointer" : ""}`}
      >
        

        <div className={`h-20 w-20 rounded-full grid place-items-center mb-4 ${avatarStyles}`}>{initials}</div>

        <div className="text-base font-bold text-[#43310b] leading-tight max-w-[220px] truncate">{title}</div>
        {subtitle && <div className="text-sm text-[#404040] max-w-[220px] truncate mt-1.5">{subtitle}</div>}
      </div>
    )
  })

  const ini = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "—"

  const fsRef = React.useRef(null)
  const canvasRef = React.useRef(null)
  const refCur = React.useRef(null)
  const refPai = React.useRef(null)
  const refMae = React.useRef(null)
  const refAP = React.useRef(null)
  const refAPF = React.useRef(null)
  const refAM = React.useRef(null)
  const refAMF = React.useRef(null)
  const refBP1 = React.useRef(null)
  const refBP2 = React.useRef(null)
  const refBM1 = React.useRef(null)
  const refBM2 = React.useRef(null)

  const [lines, setLines] = React.useState([])
  const [isFs, setIsFs] = React.useState(false)

  const addLine = (aRef, bRef, acc) => {
    const cont = canvasRef.current
    if (!cont || !aRef?.current || !bRef?.current) return
    const c = cont.getBoundingClientRect()
    const a = aRef.current.getBoundingClientRect()
    const b = bRef.current.getBoundingClientRect()
    acc.push({
      x1: a.left - c.left + a.width / 2,
      y1: a.bottom - c.top,
      x2: b.left - c.left + b.width / 2,
      y2: b.top - c.top,
    })
  }

  const recalc = React.useCallback(() => {
    const arr = []
    addLine(refPai, refCur, arr)
    addLine(refMae, refCur, arr)
    addLine(refAP, refPai, arr)
    addLine(refAPF, refPai, arr)
    addLine(refAM, refMae, arr)
    addLine(refAMF, refMae, arr)
    addLine(refBP1, refAP, arr)
    addLine(refBP2, refAPF, arr)
    addLine(refBM1, refAM, arr)
    addLine(refBM2, refAMF, arr)
    setLines(arr)
  }, [])

  React.useLayoutEffect(() => {
    recalc()
    const obs = new ResizeObserver(recalc)
    if (canvasRef.current) obs.observe(canvasRef.current)
    const onResize = () => recalc()
    if (typeof window !== "undefined") {
      window.addEventListener("resize", onResize)
    }

    const onFsChange = () => {
      const doc = document
      const active = !!doc.fullscreenElement || !!doc.webkitFullscreenElement || !!doc.msFullscreenElement
      setIsFs(active)
      setTimeout(recalc, 50)
      setTimeout(recalc, 200)
    }
    document.addEventListener("fullscreenchange", onFsChange)
    document.addEventListener("webkitfullscreenchange", onFsChange)
    document.addEventListener("MSFullscreenChange", onFsChange)

    return () => {
      obs.disconnect()
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", onResize)
      }
      document.removeEventListener("fullscreenchange", onFsChange)
      document.removeEventListener("webkitfullscreenchange", onFsChange)
      document.removeEventListener("MSFullscreenChange", onFsChange)
    }
  }, [recalc, current, parents, grandparents, greatGrandparents])

  const enterFs = async () => {
    const el = fsRef.current
    if (!el) return
    try {
      if (el.requestFullscreen) await el.requestFullscreen()
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
      else if (el.msRequestFullscreen) el.msRequestFullscreen()
    } catch (_) {}
  }

  const exitFs = async () => {
    const doc = document
    try {
      if (doc.exitFullscreen) await doc.exitFullscreen()
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen()
      else if (doc.msExitFullscreen) doc.msExitFullscreen()
    } catch (_) {}
  }

  const toggleFs = () => (isFs ? exitFs() : enterFs())

  return (
    <div className="relative">
      <div className="mb-6 flex justify-end">
        <button
          onClick={toggleFs}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-[#ffcf78] px-6 py-3 text-sm font-semibold text-[#43310b] bg-white hover:bg-[#fff7ee] transition-all  hover:shadow-xl"
          title={isFs ? "Sair da tela cheia (Esc)" : "Tela cheia"}
        >
          {isFs ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Sair
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              Tela cheia
            </>
          )}
        </button>
      </div>

      <div
        ref={fsRef}
        className={`
          relative rounded-2xl overflow-hidden
          ${isFs ? "w-screen h-screen" : ""}
          bg-[#f8fcfa]
        `}
        style={isFs ? { borderRadius: 0 } : undefined}
      >
        <div ref={canvasRef} className="relative p-4" style={{ minHeight: 350 }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fca90f" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ce7d0a" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {lines.map((l, i) => (
              <line
                key={i}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Pirâmide */}
          <div className="relative mx-auto max-w-[900px]">
            {/* Atual */}
            <div className="flex justify-center mb-10">
              <Node
                ref={refCur}
                role="current"
                title={current?.nome || "—"}
                subtitle={`${current?.raca || "—"} • ${current?.maturidade || "—"}`}
                initials={ini(current?.nome)}
                id={current?.id}
              />
            </div>

            {/* Pais */}
            <div className="flex justify-center gap-20 mb-10">
              {parents?.pai ? (
                <Node
                  ref={refPai}
                  role="parent"
                  title={parents.pai.nome}
                  subtitle={`${parents.pai.raca || "—"} • ${parents.pai.maturidade || "—"}`}
                  initials={ini(parents.pai.nome)}
                  id={parents.pai.id}
                  onClick={() => onNavigate?.(parents.pai.id)}
                />
              ) : (
                <div style={{ width: 220 }} />
              )}
              {parents?.mae ? (
                <Node
                  ref={refMae}
                  role="parent"
                  title={parents.mae.nome}
                  subtitle={`${parents.mae.raca || "—"} • ${parents.mae.maturidade || "—"}`}
                  initials={ini(parents.mae.nome)}
                  id={parents.mae.id}
                  onClick={() => onNavigate?.(parents.mae.id)}
                />
              ) : (
                <div style={{ width: 220 }} />
              )}
            </div>

            {/* Avós */}
            <div className="flex justify-center gap-12 mb-10 flex-wrap">
              {grandparents?.avoPai ? (
                <Node
                  ref={refAP}
                  role="parent"
                  title={grandparents.avoPai.nome}
                  subtitle={`${grandparents.avoPai.raca || "—"} • ${grandparents.avoPai.maturidade || "—"}`}
                  initials={ini(grandparents.avoPai.nome)}
                  id={grandparents.avoPai.id}
                  onClick={() => onNavigate?.(grandparents.avoPai.id)}
                />
              ) : (
                <div style={{ width: 220 }} />
              )}
              {grandparents?.avoPaiF ? (
                <Node
                  ref={refAPF}
                  role="parent"
                  title={grandparents.avoPaiF.nome}
                  subtitle={`${grandparents.avoPaiF.raca || "—"} • ${grandparents.avoPaiF.maturidade || "—"}`}
                  initials={ini(grandparents.avoPaiF.nome)}
                  id={grandparents.avoPaiF.id}
                  onClick={() => onNavigate?.(grandparents.avoPaiF.id)}
                />
              ) : (
                <div style={{ width: 220 }} />
              )}
              {grandparents?.avoMae ? (
                <Node
                  ref={refAM}
                  role="parent"
                  title={grandparents.avoMae.nome}
                  subtitle={`${grandparents.avoMae.raca || "—"} • ${grandparents.avoMae.maturidade || "—"}`}
                  initials={ini(grandparents.avoMae.nome)}
                  id={grandparents.avoMae.id}
                  onClick={() => onNavigate?.(grandparents.avoMae.id)}
                />
              ) : (
                <div style={{ width: 220 }} />
              )}
              {grandparents?.avoMaeF ? (
                <Node
                  ref={refAMF}
                  role="parent"
                  title={grandparents.avoMaeF.nome}
                  subtitle={`${grandparents.avoMaeF.raca || "—"} • ${grandparents.avoMaeF.maturidade || "—"}`}
                  initials={ini(grandparents.avoMaeF.nome)}
                  id={grandparents.avoMaeF.id}
                  onClick={() => onNavigate?.(grandparents.avoMaeF.id)}
                />
              ) : (
                <div style={{ width: 220 }} />
              )}
            </div>

            {/* Bisavós */}
            <div className="flex justify-center gap-8 flex-wrap">
              {greatGrandparents?.bisavoP1 ? (
                <Node
                  ref={refBP1}
                  role="grand"
                  title={greatGrandparents.bisavoP1.nome}
                  subtitle={`${greatGrandparents.bisavoP1.raca || "—"} • ${greatGrandparents.bisavoP1.maturidade || "—"}`}
                  initials={ini(greatGrandparents.bisavoP1.nome)}
                  id={greatGrandparents.bisavoP1.id}
                  onClick={() => onNavigate?.(greatGrandparents.bisavoP1.id)}
                />
              ) : (
                <div style={{ width: 220 }} />
              )}
              {greatGrandparents?.bisavoP2 ? (
                <Node
                  ref={refBP2}
                  role="grand"
                  title={greatGrandparents.bisavoP2.nome}
                  subtitle={`${greatGrandparents.bisavoP2.raca || "—"} • ${greatGrandparents.bisavoP2.maturidade || "—"}`}
                  initials={ini(greatGrandparents.bisavoP2.nome)}
                  id={greatGrandparents.bisavoP2.id}
                  onClick={() => onNavigate?.(greatGrandparents.bisavoP2.id)}
                />
              ) : (
                <div style={{ width: 220 }} />
              )}
              {greatGrandparents?.bisavoM1 ? (
                <Node
                  ref={refBM1}
                  role="grand"
                  title={greatGrandparents.bisavoM1.nome}
                  subtitle={`${greatGrandparents.bisavoM1.raca || "—"} • ${greatGrandparents.bisavoM1.maturidade || "—"}`}
                  initials={ini(greatGrandparents.bisavoM1.nome)}
                  id={greatGrandparents.bisavoM1.id}
                  onClick={() => onNavigate?.(greatGrandparents.bisavoM1.id)}
                />
              ) : (
                <div style={{ width: 220 }} />
              )}
              {greatGrandparents?.bisavoM2 ? (
                <Node
                  ref={refBM2}
                  role="grand"
                  title={greatGrandparents.bisavoM2.nome}
                  subtitle={`${greatGrandparents.bisavoM2.raca || "—"} • ${greatGrandparents.bisavoM2.maturidade || "—"}`}
                  initials={ini(greatGrandparents.bisavoM2.nome)}
                  id={greatGrandparents.bisavoM2.id}
                  onClick={() => onNavigate?.(greatGrandparents.bisavoM2.id)}
                />
              ) : (
                <div style={{ width: 220 }} />
              )}
            </div>
          </div>
        </div>
      </  div>

      <div className="mt-8 flex flex-wrap items-center gap-8 text-sm bg-white rounded-xl p-6 border-2 border-[#ffcf78] ">
        <span className="inline-flex items-center gap-3 font-semibold text-[#43310b]">
          <i className="h-4 w-4 rounded-full bg-[#fca90f] shadow-md" /> Atual
        </span>
        <span className="inline-flex items-center gap-3 font-semibold text-[#43310b]">
          <i className="h-4 w-4 rounded-full bg-[#ffcf78] shadow-md" /> Pais/Avós
        </span>
        <span className="inline-flex items-center gap-3 font-semibold text-[#404040]">
          <i className="h-4 w-4 rounded-full bg-[#b0b0b0] shadow-md" /> Bisavós
        </span>
      </div>
    </div>
  )
}
