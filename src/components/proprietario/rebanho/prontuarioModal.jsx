"use client";

import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaWeight,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import ResumoTab from "./tabs/ResumoTab";
import SanitariosTab from "./tabs/SanitariosTab";
import GenealogiaTab from "./tabs/GenealogiaTab";
import ZootecnicoTab from "./tabs/ZootecnicoTab";
import bufaloService from "@/services/bufaloService";

export default function BuffaloModal({ open, onClose, idBufalo }) {
  const [activeTab, setActiveTab] = useState("Resumo");
  const [bufaloData, setBufaloData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && idBufalo) {
      setLoading(true);
      bufaloService
        .buscarBufaloPorId(idBufalo)
        .then((data) => setBufaloData(data))
        .catch((error) => console.error("Erro ao buscar búfalo:", error))
        .finally(() => setLoading(false));
    }
  }, [open, idBufalo]);

  if (!open) return null;

  if (loading) {
    return (
      <div
        className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-[min(96vw,1200px)] max-h-[92vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden">
          <div className="flex items-center justify-center p-6">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!bufaloData) {
    return (
      <div
        className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-[min(96vw,1200px)] max-h-[92vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden">
          <div className="flex items-center justify-center p-6">
            Erro ao carregar dados do búfalo.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-[min(96vw,1200px)] max-h-[95vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white rounded-t-3xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Prontuário • {bufaloData.nome}
                  </h2>
                  <span
                    className={`text-xs px-2 py-1 rounded-full uppercase tracking-wide ${
                      bufaloData.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {bufaloData.status ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Brinco: {bufaloData.brinco} •{" "}
                  {bufaloData.sexo === "F" ? "Fêmea" : "Macho"} •{" "}
                  {bufaloData.raca?.nome} • {bufaloData.id_propriedade}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 grid place-items-center rounded-xl border border-gray-200 hover:bg-gray-50 text-xl font-bold text-gray-600"
              aria-label="Fechar modal"
            >
              ×
            </button>
          </div>
          {/* Abas */}
          <div className="flex gap-1 px-3 pb-3">
            {["Resumo", "Zootécnico", "Sanitários", "Genealogia"].map((label) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  activeTab === label
                    ? "bg-amber-50 text-amber-900 border-amber-200 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {/* Conteúdo */}
        <div className="flex-1 p-6 min-h-[700px] max-h-[700px] overflow-y-auto">
          {activeTab === "Resumo" && <ResumoTab bufaloData={bufaloData} />}
          {activeTab === "Genealogia" && <GenealogiaTab bufaloData={bufaloData} />}
          {activeTab === "Sanitários" && <SanitariosTab bufaloData={bufaloData} />}
          {activeTab === "Zootécnico" && <ZootecnicoTab bufaloData={bufaloData} />}
        </div>
      </div>
    </div>
  );
}


