import React, { useEffect, useState } from "react";
import GenealogyTree from "@/components/proprietario/rebanho/tabs/genealogy-tree";
import bufaloService from "@/services/bufaloService";

export default function GenealogiaTab({ bufaloData }) {
  const [genealogyData, setGenealogyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGenealogy() {
      try {
        // Busca o búfalo principal
        const bufalo = bufaloData;
        // Busca os pais
        const pai = bufalo.id_pai ? await bufaloService.buscarBufaloPorId(bufalo.id_pai) : null;
        const mae = bufalo.id_mae ? await bufaloService.buscarBufaloPorId(bufalo.id_mae) : null;
        // Busca avós
        const avoPai = pai && pai.id_pai ? await bufaloService.buscarBufaloPorId(pai.id_pai) : null;
        const avoPaiF = pai && pai.id_mae ? await bufaloService.buscarBufaloPorId(pai.id_mae) : null;
        const avoMae = mae && mae.id_pai ? await bufaloService.buscarBufaloPorId(mae.id_pai) : null;
        const avoMaeF = mae && mae.id_mae ? await bufaloService.buscarBufaloPorId(mae.id_mae) : null;
        // Busca bisavós
        const bisavoP1 = avoPai && avoPai.id_pai ? await bufaloService.buscarBufaloPorId(avoPai.id_pai) : null;
        const bisavoP2 = avoPai && avoPai.id_mae ? await bufaloService.buscarBufaloPorId(avoPai.id_mae) : null;
        const bisavoM1 = avoMae && avoMae.id_pai ? await bufaloService.buscarBufaloPorId(avoMae.id_pai) : null;
        const bisavoM2 = avoMae && avoMae.id_mae ? await bufaloService.buscarBufaloPorId(avoMae.id_mae) : null;

        // Log de todos os IDs recebidos
        const allBufalos = [bufalo, pai, mae, avoPai, avoPaiF, avoMae, avoMaeF, bisavoP1, bisavoP2, bisavoM1, bisavoM2];
        console.log("IDs recebidos:", allBufalos.map(b => b ? (b.id || b.id_bufalo || "—") : "—"));

        // Filtra campos nulos
        const filterNulls = (obj) => {
          if (!obj) return undefined;
          const filtered = Object.fromEntries(Object.entries(obj).filter(([_, v]) => v));
          return Object.keys(filtered).length > 0 ? filtered : undefined;
        };

        const getId = (obj) => obj ? (obj.id || obj.id_bufalo || "—") : "—";

        // Função para traduzir o nível de maturidade
        const maturidadeLabel = (nivel) => {
          switch (nivel) {
            case "V": return "Vaca";
            case "N": return "Novilha";
            case "T": return "Touro";
            case "B": return "Bezerro";
            default: return "—";
          }
        };

        const parents = filterNulls({
          pai: pai ? { id: getId(pai), nome: pai.nome, raca: pai.raca?.nome || "", prod: pai.prod || "", maturidade: maturidadeLabel(pai.nivel_maturidade) } : null,
          mae: mae ? { id: getId(mae), nome: mae.nome, raca: mae.raca?.nome || "", prod: mae.prod || "", maturidade: maturidadeLabel(mae.nivel_maturidade) } : null,
        });
        const grandparents = filterNulls({
          avoPai: avoPai ? { id: getId(avoPai), nome: avoPai.nome, raca: avoPai.raca?.nome || "", prod: avoPai.prod || "", maturidade: maturidadeLabel(avoPai.nivel_maturidade) } : null,
          avoPaiF: avoPaiF ? { id: getId(avoPaiF), nome: avoPaiF.nome, raca: avoPaiF.raca?.nome || "", prod: avoPaiF.prod || "", maturidade: maturidadeLabel(avoPaiF.nivel_maturidade) } : null,
          avoMae: avoMae ? { id: getId(avoMae), nome: avoMae.nome, raca: avoMae.raca?.nome || "", prod: avoMae.prod || "", maturidade: maturidadeLabel(avoMae.nivel_maturidade) } : null,
          avoMaeF: avoMaeF ? { id: getId(avoMaeF), nome: avoMaeF.nome, raca: avoMaeF.raca?.nome || "", prod: avoMaeF.prod || "", maturidade: maturidadeLabel(avoMaeF.nivel_maturidade) } : null,
        });
        const greatGrandparents = filterNulls({
          bisavoP1: bisavoP1 ? { id: getId(bisavoP1), nome: bisavoP1.nome, raca: bisavoP1.raca?.nome || "", maturidade: maturidadeLabel(bisavoP1.nivel_maturidade) } : null,
          bisavoP2: bisavoP2 ? { id: getId(bisavoP2), nome: bisavoP2.nome, raca: bisavoP2.raca?.nome || "", maturidade: maturidadeLabel(bisavoP2.nivel_maturidade) } : null,
          bisavoM1: bisavoM1 ? { id: getId(bisavoM1), nome: bisavoM1.nome, raca: bisavoM1.raca?.nome || "", maturidade: maturidadeLabel(bisavoM1.nivel_maturidade) } : null,
          bisavoM2: bisavoM2 ? { id: getId(bisavoM2), nome: bisavoM2.nome, raca: bisavoM2.raca?.nome || "", maturidade: maturidadeLabel(bisavoM2.nivel_maturidade) } : null,
        });

        setGenealogyData({
          current: {
            id: getId(bufalo),
            nome: bufalo.nome,
            raca: bufalo.raca?.nome || "",
            maturidade: maturidadeLabel(bufalo.nivel_maturidade)
          },
          ...(parents ? { parents } : {}),
          ...(grandparents ? { grandparents } : {}),
          ...(greatGrandparents ? { greatGrandparents } : {}),
        });
      } catch (err) {
        setGenealogyData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchGenealogy();
  }, [bufaloData]);

  if (loading) {
    return <div className="p-6">Carregando árvore genealógica...</div>;
  }
  if (!genealogyData) {
    return <div className="p-6 text-red-500">Erro ao carregar genealogia.</div>;
  }

  return (
    <div className="space-y-6 h-full">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Árvore Genealógica</h3>
        <p className="text-sm text-gray-500">{genealogyData.current.nome}</p>
        <div className="mt-6 bg-white rounded-xl  p-8 border border-gray-200">
          <GenealogyTree
            current={genealogyData.current}
            parents={genealogyData.parents}
            grandparents={genealogyData.grandparents}
            greatGrandparents={genealogyData.greatGrandparents}
          />
        </div>
      </div>
    </div>
  );
}