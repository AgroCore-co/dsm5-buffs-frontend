import React from "react";
import dynamic from "next/dynamic";
const MapaGrupoPiquetes = dynamic(() => import("@/components/MapaGrupoPiquetes"), { ssr: false });

export default function GrupoMapaTab({ lotes, loteAtualId, lotesLoading, lotesError }) {
  return (
    <div className="w-full" style={{height: "65vh"}}>
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 h-full flex flex-col">
        <h3 className="text-xl font-bold text-green-700 mb-4 border-b border-green-100 pb-2">
          Localização Atual do Grupo
        </h3>
        <div className="flex-1 min-h-0">
          {lotesLoading ? (
            <div className="text-gray-500 h-full flex items-center justify-center">Carregando piquetes...</div>
          ) : lotesError ? (
            <div className="text-red-500 h-full flex items-center justify-center">{lotesError}</div>
          ) : lotes.length === 0 ? (
            <div className="text-gray-500 h-full flex items-center justify-center">Nenhum piquete encontrado para exibir no mapa.</div>
          ) : (
            <MapaGrupoPiquetes lotes={lotes} loteDestacadoId={loteAtualId} height="60vh" />
          )}
        </div>
      </section>
    </div>
  );
}
