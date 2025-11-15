"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import propriedadeService from "@/services/propriedadeService";
import dashboardService from "@/services/dashboardService";
import alimentacaoDefService from "@/services/alimentacaoDefService";
import alimentacaoRegistroService from "@/services/alimentacaoRegistroService";
import grupoService from "@/services/grupoService";
import dynamic from "next/dynamic";
import GrupoDetalhesModal from "@/components/proprietario/propriedades/GrupoDetalhesModal";
import GrupoCreateModal from "@/components/proprietario/propriedades/GrupoCreateModal";
import GrupoEditModal from "@/components/proprietario/propriedades/GrupoEditModal";
import LoteEditModal from "@/components/proprietario/propriedades/LoteEditModal";
import DeleteLoteModal from '@/components/proprietario/propriedades/DeleteLoteModal';
import DeleteGrupoModal from '@/components/proprietario/propriedades/DeleteGrupoModal';
import LoteCreateModal from '@/components/proprietario/propriedades/LoteCreateModal';
import { getMyProfile } from "@/services/userService";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

export default function PropriedadePage() {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState("propriedade");
  const [propriedade, setPropriedade] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grupos, setGrupos] = useState([]);
  const [loadingGrupos, setLoadingGrupos] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    async function fetchPropriedade() {
      if (!id) return;
      setLoading(true);
      try {
        const prop = await propriedadeService.buscarPropriedadePorId(id);
        setPropriedade(prop);
        // Fetch dashboard stats
        const stats = await dashboardService.getDashboardStatsByPropriedadeId(
          id
        );
        setDashboardStats(stats);
      } catch {
        setPropriedade(null);
        setDashboardStats(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPropriedade();
  }, [id]);

  useEffect(() => {
    async function fetchGrupos() {
      if (!id) return;
      setLoadingGrupos(true);
      try {
        const res = await grupoService.listarGruposPorPropriedade(id, 1, 20);
        setGrupos(res.data || []);
      } catch {
        setGrupos([]);
      } finally {
        setLoadingGrupos(false);
      }
    }
    fetchGrupos();
  }, [id]);

  useEffect(() => {
    async function fetchUsuarioLogado() {
      try {
        const user = await getMyProfile();
        setUsuarioLogado(user);
      } catch {
        setUsuarioLogado(null);
      }
    }
    fetchUsuarioLogado();
  }, []);

  // Função utilitária para cor do status
  function getStatusColor(status) {
    switch (status) {
      case "Normal":
        return "bg-green-100 text-green-700";
      case "Crítico":
      case "Baixo":
        return "bg-red-100 text-red-700";
      case "Alerta":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  // Função utilitária para texto do status
  function formatStatus(status) {
    switch (status) {
      case "Normal":
        return "Normal";
      case "Crítico":
      case "Baixo":
        return "Estoque Crítico";
      case "Alerta":
        return "Alerta";
      default:
        return status;
    }
  }

  // Mapear código de nível para label amigável
  function nivelLabel(code) {
    if (!code) return '-';
    switch ((code || '').toUpperCase()) {
      case 'B':
        return 'Bezerro';
      case 'N':
        return 'Novilha';
      case 'V':
        return 'Vaca';
      case 'T':
        return 'Touro';
      default:
        return code;
    }
  }



  // Importação dinâmica para evitar SSR do leaflet
  const MapaPiquetes = dynamic(() => import("@/components/MapaPiquetes"), { ssr: false });

  // Componente da aba Propriedade (resumo simples)
  function PropriedadeTab() {
    return (
      <div className="flex flex-col gap-6">
        <div className="w-full flex flex-col bg-white rounded-xl p-4 gap-3 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Visão Geral da Propriedade</h2>
            <p className="text-sm text-gray-600">Resumo rápido das métricas e informações da propriedade.</p>
          </div>

          <div className="grid gap-4 mt-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col">
              <div className="text-sm text-gray-500">Machos ativos</div>
              <div className="text-2xl font-bold text-gray-800">{dashboardStats?.qtd_macho_ativos ?? '-'}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col">
              <div className="text-sm text-gray-500">Fêmeas ativas</div>
              <div className="text-2xl font-bold text-gray-800">{dashboardStats?.qtd_femeas_ativas ?? '-'}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col">
              <div className="text-sm text-gray-500">Lotes</div>
              <div className="text-2xl font-bold text-gray-800">{dashboardStats?.qtd_lotes ?? '-'}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col">
              <div className="text-sm text-gray-500">Usuários</div>
              <div className="text-2xl font-bold text-gray-800">{dashboardStats?.qtd_usuarios ?? '-'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function PiquetesTab() {
  // Estado para lotes e modal
  const [lotes, setLotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLoteId, setEditLoteId] = useState(null);
  const [modalEditLoteOpen, setModalEditLoteOpen] = useState(false);
  const [deleteLoteId, setDeleteLoteId] = useState(null);
  const [deletingLote, setDeletingLote] = useState(false);
  const [errorDeleteLote, setErrorDeleteLote] = useState('');
  const [createLoteGeo, setCreateLoteGeo] = useState(null);
  const [createLoteOpen, setCreateLoteOpen] = useState(false);
  const [createLoteArea, setCreateLoteArea] = useState(null);

  // Estados para edição/exclusão de grupos
  const [editGrupoId, setEditGrupoId] = useState(null);
  const [modalEditGrupoOpen, setModalEditGrupoOpen] = useState(false);
  const [modalCreateGrupoOpen, setModalCreateGrupoOpen] = useState(false);
  const [formGrupo, setFormGrupo] = useState({ nome_grupo: "", color: "", nivel_maturidade: "" });
  // Modal de detalhes do grupo
  const [grupoDetalhesOpen, setGrupoDetalhesOpen] = useState(false);
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);

  function handleOpenGrupoDetalhes(grupo) {
    setGrupoSelecionado(grupo);
    setGrupoDetalhesOpen(true);
  }
  function handleCloseGrupoDetalhes() {
    setGrupoDetalhesOpen(false);
    setGrupoSelecionado(null);
  }
  const [savingGrupo, setSavingGrupo] = useState(false);
  const [deletingGrupoId, setDeletingGrupoId] = useState(null);
  const [deletingGrupo, setDeletingGrupo] = useState(false);
  const [errorGrupo, setErrorGrupo] = useState("");

    // Buscar lotes da propriedade ao montar o componente
    useEffect(() => {
      async function fetchLotes() {
        if (!id) return;
        try {
          const loteList = await (await import("@/services/loteService")).default.listarLotesPorPropriedade(id);
          setLotes(loteList);
        } catch (err) {
          setLotes([]);
        }
      }
      fetchLotes();
    }, [id]);

    // Função para confirmar exclusão de lote (chama serviço dinamicamente)
    async function handleConfirmDeleteLote() {
      if (!deleteLoteId) return;
      setDeletingLote(true);
      setErrorDeleteLote('');
      try {
        const loteService = (await import('@/services/loteService')).default;
        const res = await loteService.removerLote(deleteLoteId);
        if (res && res.success) {
          setLotes(prev => prev.filter(l => l.id_lote !== deleteLoteId));
          setDeleteLoteId(null);
        } else {
          const msg = res && res.error && res.error.message ? res.error.message : 'Erro ao excluir lote';
          setErrorDeleteLote(msg);
        }
      } catch (err) {
        setErrorDeleteLote(err?.message || 'Erro inesperado');
      } finally {
        setDeletingLote(false);
      }
    }

    // Listen for drawn polygon from MapaPiquetes
    useEffect(() => {
      function handler(e) {
        const geo = e?.detail?.geo_mapa;
        const area_m2 = e?.detail?.area_m2 ?? null;
        if (geo) {
          setCreateLoteGeo(geo);
          setCreateLoteArea(area_m2);
          setCreateLoteOpen(true);
        }
      }
      if (typeof window !== "undefined") {
        window.addEventListener('mapa:nova-geometria', handler);
        return () => window.removeEventListener('mapa:nova-geometria', handler);
      }
      return undefined;
    }, []);

    // Funções para manipular edição/exclusão de grupos
    function openEditGrupoModal(grupo) {
      setEditGrupoId(grupo.id_grupo || grupo.id || grupo._id);
      setFormGrupo({ nome_grupo: grupo.nome_grupo || "", color: grupo.color || "", nivel_maturidade: grupo.nivel_maturidade || "" });
      setModalEditGrupoOpen(true);
      setErrorGrupo("");
    }

    async function handleEditGrupo(e) {
      e.preventDefault();
      if (!editGrupoId) return;
      setSavingGrupo(true);
      setErrorGrupo("");
      try {
        const updated = await (await import("@/services/grupoService")).default.atualizarGrupo(editGrupoId, formGrupo);
        // atualizar lista local de grupos
        setGrupos((prev) => prev.map(g => (g.id_grupo === editGrupoId || g.id === editGrupoId || g._id === editGrupoId) ? updated : g));
        setModalEditGrupoOpen(false);
      } catch (err) {
        setErrorGrupo("Erro ao atualizar grupo. Verifique os dados.");
      } finally {
        setSavingGrupo(false);
      }
    }

    function openDeleteGrupoModal(gid) {
      setDeletingGrupoId(gid);
    }

    async function handleDeleteGrupo() {
      if (!deletingGrupoId) return;
      setDeletingGrupo(true);
      setErrorGrupo("");
      try {
        const res = await (await import("@/services/grupoService")).default.removerGrupo(deletingGrupoId);
        if (res && res.success) {
          setGrupos((prev) => prev.filter(g => !(g.id_grupo === deletingGrupoId || g.id === deletingGrupoId || g._id === deletingGrupoId)));
          setDeletingGrupoId(null);
        } else {
          // If server indicates failure, show friendly message (likely foreign key constraint)
          const msg = (res && res.error && res.error.message) ? res.error.message : 'Falha ao deletar o grupo.';
          console.warn('Remover grupo falhou', res);
          setErrorGrupo(msg + (res?.error?.statusCode ? ` (Código: ${res.error.statusCode})` : ''));
        }
      } catch (err) {
        console.error('Erro inesperado ao deletar grupo', err);
        setErrorGrupo('Erro inesperado ao deletar grupo. Tente novamente.');
      } finally {
        setDeletingGrupo(false);
      }
    } 

    return (
      <div className="flex flex-col gap-6">
  <MapaPiquetes propriedadeId={id} lotes={lotes} onLotesChange={setLotes} />

        {/* Listagem dos piquetes em cards */}
        <div className="w-full flex flex-col bg-white rounded-xl p-4 gap-3 box-border border border-[#e0e0e0] shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Visão Geral dos Lotes</h2>
              <p className="text-sm text-gray-600">{lotes.length} lotes ativos</p>
            </div>
            <button className="bg-[#FFCF78] text-gray-800 py-1 px-3 rounded text-xs font-bold hover:bg-[#F2B84D] transition-colors" onClick={() => setModalOpen(true)}>
              Ver Todos
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {lotes.slice(0, 6).map((lote) => (
              <div key={lote.id_lote} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">{lote.nome_lote}</h3>
                  <span className={`w-2 h-2 rounded-full ${lote.status === "ativo" ? "bg-green-500" : "bg-red-500"}`}></span>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 mb-2 truncate" title={lote.id_lote}>
                    ID: {lote.id_lote}
                  </div>
                  <div className="text-xs text-gray-600">
                    <div><span className="font-bold">{lote.qtd_max || 0}</span> búfalos</div>
                    <div className="truncate"><span className="font-bold">{lote.area_m2 || "-"}</span> m²</div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="inline-block w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: lote.grupo?.color || '#444444' }}
                      title={lote.grupo?.nome_grupo || 'Sem grupo'}
                    ></span>
                    <span className="text-xs text-gray-700 font-medium">{lote.grupo?.nome_grupo || 'Sem grupo'}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      // className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-600 transition-colors"
                      className="bg-[#FCA90F] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#e6b866] transition-colors"

                      onClick={() => { setEditLoteId(lote.id_lote); setModalEditLoteOpen(true); }}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-[#CE7D0A]  text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#FFCF78] transition-colors"
                      onClick={() => setDeleteLoteId(lote.id_lote)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabela de Grupos alinhada ao estilo dos blocos de Visão Geral dos Lotes */}
        <div className="w-full flex flex-col bg-white rounded-xl p-4 gap-3 box-border border border-[#e0e0e0] shadow-sm mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Grupos</h2>
              <p className="text-sm text-gray-600">{loadingGrupos ? 'Carregando grupos...' : `${grupos.length} grupo${grupos.length !== 1 ? 's' : ''}`}</p>
            </div>
            <button
              className="bg-[#FFCF78] text-gray-800 py-1 px-3 rounded text-xs font-bold hover:bg-[#F2B84D] transition-colors"
              onClick={() => { setEditGrupoId(null); setFormGrupo({ nome_grupo: '', color: '', nivel_maturidade: '' }); setModalCreateGrupoOpen(true); }}
            >
              + Criar Grupo
            </button>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full border-collapse min-w-[700px] bg-white rounded-lg overflow-hidden">
              <thead className="bg-[#f8f8f8]">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-800 text-sm">ID</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-sm">Nome</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-sm">Cor</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-sm">Nível</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-sm">Status</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-sm">Piquete</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-sm">Desde</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-sm">Dias no Local</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-sm">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {grupos.map((grupo, index) => {
                  const gid = grupo.id_grupo || grupo.id || grupo._id;
                  const isEven = index % 2 === 1;
                  // Estado para status do grupo
                  const [statusGrupo, setStatusGrupo] = useState(null);
                  const [nomeLote, setNomeLote] = useState('-');
                  useEffect(() => {
                    let mounted = true;
                    async function fetchStatusAndLote() {
                      try {
                        const movLoteService = (await import('@/services/movLoteService')).default;
                        const status = await movLoteService.verificarStatusGrupo(gid);
                        if (mounted) setStatusGrupo(status);
                        // Buscar nome do lote se houver id_lote
                        if (status?.localizacao_atual?.id_lote) {
                          const loteService = (await import('@/services/loteService')).default;
                          const lote = await loteService.buscarLotePorId(status.localizacao_atual.id_lote);
                          if (mounted) setNomeLote(lote?.nome_lote || '-');
                        } else {
                          if (mounted) setNomeLote('-');
                        }
                      } catch (err) {
                        if (mounted) {
                          setStatusGrupo({ mensagem: 'Sem movimentações', notFound: true });
                          setNomeLote('-');
                        }
                      }
                    }
                    fetchStatusAndLote();
                    return () => { mounted = false; };
                  }, [gid]);
                  return (
                    <tr
                      key={gid}
                      style={{ backgroundColor: isEven ? 'var(--table-row-even)' : 'white', cursor: 'pointer' }}
                      className="hover:opacity-95"
                      onClick={() => handleOpenGrupoDetalhes(grupo)}
                    >
                      <td className="p-3 text-center text-gray-500 text-xs" title={gid}>{gid ? gid : '-'}</td>
                      <td className="p-3 text-center text-gray-800 text-sm font-medium">{grupo.nome_grupo}</td>
                      <td className="p-3 text-center text-gray-700 text-sm">
                        <div className="inline-flex items-center gap-2 justify-center">
                          <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: grupo.color || '#ddd' }} />
                          <span className="text-sm text-gray-700">{grupo.color || '-'}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center text-gray-800 text-sm">{nivelLabel(grupo.nivel_maturidade)}</td>
                      {/* STATUS COLUMN */}
                      <td className="p-3 text-center text-gray-800 text-sm">
                        {statusGrupo === null ? (
                          <span className="text-gray-400">Carregando...</span>
                        ) : statusGrupo.notFound ? (
                          <span className="text-red-500">Grupo sem movimentações registradas</span>
                        ) : statusGrupo.localizacao_atual ? (
                          <span className="text-green-700">Em lote</span>
                        ) : (
                          <span className="text-gray-500">Status desconhecido</span>
                        )}
                      </td>
                      {/* NOME DO PIQUETE (LOTE) */}
                      <td className="p-3 text-center text-gray-800 text-xs">{statusGrupo === null ? <span className="text-gray-400">Carregando...</span> : nomeLote}</td>
                      <td className="p-3 text-center text-gray-800 text-xs">{statusGrupo?.localizacao_atual?.desde ? new Date(statusGrupo.localizacao_atual.desde).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}</td>
                      <td className="p-3 text-center text-gray-800 text-xs">{statusGrupo?.localizacao_atual?.dias_no_local != null ? statusGrupo.localizacao_atual.dias_no_local : '-'}</td>
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center gap-2 justify-center">
                          <button
                            className="bg-[#FCA90F] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#e6b866] transition-colors"
                            onClick={e => { e.stopPropagation(); openEditGrupoModal(grupo); }}
                          >
                            Editar
                          </button>
                          <button
                            className="bg-[#CE7D0A] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#e6b866] transition-colors"
                            onClick={e => { e.stopPropagation(); openDeleteGrupoModal(gid); }}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>



        {/* Create / Edit Grupo Modals (componentized) */}
        <GrupoCreateModal
          isOpen={modalCreateGrupoOpen}
          onClose={() => setModalCreateGrupoOpen(false)}
          propriedadeId={id}
          onCreated={(created) => setGrupos(prev => [...prev, created])}
        />
        <GrupoEditModal
          isOpen={modalEditGrupoOpen}
          onClose={() => setModalEditGrupoOpen(false)}
          grupoId={editGrupoId}
          initialData={grupos.find(g => (g.id_grupo || g.id || g._id) === editGrupoId) || {}}
          onUpdated={(updated) => setGrupos(prev => prev.map(g => ((g.id_grupo || g.id || g._id) === editGrupoId ? updated : g)))}
        />

        <LoteEditModal
          isOpen={modalEditLoteOpen}
          onClose={() => { setModalEditLoteOpen(false); setEditLoteId(null); }}
          loteId={editLoteId}
          initialData={lotes.find(l => l.id_lote === editLoteId) || {}}
          grupos={grupos}
          propriedadeId={id}
          onUpdated={(updated) => setLotes(prev => prev.map(l => (l.id_lote === editLoteId ? updated : l)))}
        />

        {/* Modal de detalhes do grupo */}
        <GrupoDetalhesModal open={grupoDetalhesOpen} onClose={handleCloseGrupoDetalhes} grupo={grupoSelecionado} />

        <LoteCreateModal
          isOpen={createLoteOpen}
          onClose={() => { setCreateLoteOpen(false); setCreateLoteGeo(null); setCreateLoteArea(null); }}
          geo_mapa={createLoteGeo}
          area_m2={createLoteArea}
          propriedadeId={id}
          grupos={grupos}
          onCreated={(created) => setLotes(prev => [...prev, created])}
        />

        <DeleteLoteModal
          isOpen={Boolean(deleteLoteId)}
          onClose={() => setDeleteLoteId(null)}
          onConfirm={handleConfirmDeleteLote}
          loading={deletingLote}
          error={errorDeleteLote}
        />

        <DeleteGrupoModal
          isOpen={Boolean(deletingGrupoId)}
          onClose={() => setDeletingGrupoId(null)}
          onConfirm={handleDeleteGrupo}
          loading={deletingGrupo}
          error={errorGrupo}
        />

        {/* Modal de todos os lotes */}
        {modalOpen && (
          <div className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/45">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full relative flex flex-col gap-4 border border-[#e0e0e0] max-h-[90vh]">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                onClick={() => setModalOpen(false)}
                aria-label="Fechar"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Todos os Lotes</h2>
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {lotes.map((lote) => (
                    <div key={lote.id_lote} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-semibold text-gray-800 truncate">{lote.nome_lote}</h3>
                        <span className={`w-2 h-2 rounded-full ${lote.status === "ativo" ? "bg-green-500" : "bg-red-500"}`}></span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2 truncate" title={lote.id_lote}>
                        ID: {lote.id_lote}
                      </div>
                      <div className="text-xs text-gray-600 mb-1">{lote.tipo_lote}</div>
                      <div className="space-y-1">
                        <div><span className="font-bold">{lote.qtd_max || 0}</span> búfalos</div>
                        <div className="truncate"><span className="font-bold">{lote.area_m2 || "-"}</span> m²</div>
                        {lote.descricao && <div className="text-xs text-gray-500 mt-1">{lote.descricao}</div>}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-block w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: lote.grupo?.color || '#444444' }} title={lote.grupo?.nome_grupo || 'Sem grupo'} />
                          <span className="text-xs text-gray-700 font-medium">{lote.grupo?.nome_grupo || 'Sem grupo'}</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            className="bg-[#FCA90F] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#e6b866] transition-colors"
                            onClick={() => { setEditLoteId(lote.id_lote); setModalEditLoteOpen(true); setModalOpen(false); }}
                          >
                            Editar
                          </button>
                          <button
                            className="bg-[#CE7D0A] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#e6b866] transition-colors"
                            onClick={() => { setDeleteLoteId(lote.id_lote); setModalOpen(false); }}
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const AlimentacaoTab = () => {
    const [definicoes, setDefinicoes] = useState([]);
    const [loadingDef, setLoadingDef] = useState(true);
    const [registros, setRegistros] = useState([]);
    const [loadingReg, setLoadingReg] = useState(true);
    const [modalDefOpen, setModalDefOpen] = useState(false);
    const [formDef, setFormDef] = useState({ tipo_alimentacao: "", descricao: "" });
    const [savingDef, setSavingDef] = useState(false);
    const [errorDef, setErrorDef] = useState("");
    const [editDefId, setEditDefId] = useState(null);
    const [formEditDef, setFormEditDef] = useState({ tipo_alimentacao: "", descricao: "" });
    const [savingEditDef, setSavingEditDef] = useState(false);
    const [errorEditDef, setErrorEditDef] = useState("");
    const [deleteDefId, setDeleteDefId] = useState(null);
    const [deletingDef, setDeletingDef] = useState(false);
    const [errorDeleteDef, setErrorDeleteDef] = useState("");
    const [modalRegistroOpen, setModalRegistroOpen] = useState(false);
    const [formRegistro, setFormRegistro] = useState({
      id_grupo: "",
      id_aliment_def: "",
      id_usuario: "",
      quantidade: "",
      unidade_medida: "kg",
      freq_dia: "",
      dt_registro: ""
    });
    const [savingRegistro, setSavingRegistro] = useState(false);
    const [errorRegistro, setErrorRegistro] = useState("");
    const [editRegistroId, setEditRegistroId] = useState(null);
    const [formEditRegistro, setFormEditRegistro] = useState({
      quantidade: "",
      unidade_medida: "kg",
      freq_dia: ""
    });
    const [savingEditRegistro, setSavingEditRegistro] = useState(false);
    const [errorEditRegistro, setErrorEditRegistro] = useState("");
    const [deleteRegistroId, setDeleteRegistroId] = useState(null);
    const [deletingRegistro, setDeletingRegistro] = useState(false);
    const [errorDeleteRegistro, setErrorDeleteRegistro] = useState("");
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
      async function fetchDefinicoes() {
        if (!id) return;
        setLoadingDef(true);
        try {
          const defs = await alimentacaoDefService.listarDefinicoesPorPropriedade(id);
          setDefinicoes(defs);
        } catch {
          setDefinicoes([]);
        } finally {
          setLoadingDef(false);
        }
      }
      fetchDefinicoes();
    }, [id]);

    useEffect(() => {
      async function fetchRegistros() {
        if (!id) return;
        setLoadingReg(true);
        try {
          const regs = await alimentacaoRegistroService.listarRegistrosPorPropriedade(id);
          setRegistros(regs);
        } catch {
          setRegistros([]);
        } finally {
          setLoadingReg(false);
        }
      }
      fetchRegistros();
    }, [id]);

    useEffect(() => {
      if (usuarioLogado && modalRegistroOpen) {
        setFormRegistro(f => ({ ...f, id_usuario: usuarioLogado.id_usuario }));
      }
    }, [usuarioLogado, modalRegistroOpen]);

    // Indicadores dinâmicos
    const tiposRacao = definicoes.length;
    const consumoDiarioTotal = registros.reduce((acc, reg) => acc + (reg.quantidade || 0), 0);
    const estoqueCritico = registros.filter(
      reg => reg.quantidade < 100 // ajuste o valor conforme sua regra de negócio
    ).length;
    // Novo indicador: Total de registros
    const totalRegistros = registros.length;

    // Função para criar definição
    async function handleCreateDefinicao(e) {
      e.preventDefault();
      setSavingDef(true);
      setErrorDef("");
      try {
        const newDef = await alimentacaoDefService.criarDefinicaoAlimentacao({
          id_propriedade: id,
          tipo_alimentacao: formDef.tipo_alimentacao,
          descricao: formDef.descricao,
        });
        setDefinicoes((prev) => [...prev, newDef]);
        setModalDefOpen(false);
        setFormDef({ tipo_alimentacao: "", descricao: "" });
      } catch (err) {
        setErrorDef("Erro ao criar definição. Verifique os campos.");
      } finally {
        setSavingDef(false);
      }
    }

    // Função para abrir modal de edição
    function openEditDefModal(def) {
      setEditDefId(def.id_aliment_def);
      setFormEditDef({ tipo_alimentacao: def.tipo_alimentacao, descricao: def.descricao || "" });
    }

    // Função para atualizar definição
    async function handleEditDefinicao(e) {
      e.preventDefault();
      setSavingEditDef(true);
      setErrorEditDef("");
      try {
        const updatedDef = await alimentacaoDefService.atualizarDefinicaoAlimentacao(editDefId, {
          id_propriedade: id,
          tipo_alimentacao: formEditDef.tipo_alimentacao,
          descricao: formEditDef.descricao,
        });
        setDefinicoes((prev) => prev.map(def => def.id_aliment_def === editDefId ? updatedDef : def));
        setEditDefId(null);
        setFormEditDef({ tipo_alimentacao: "", descricao: "" });
      } catch (err) {
        setErrorEditDef("Erro ao atualizar definição. Verifique os campos.");
      } finally {
        setSavingEditDef(false);
      }
    }

    // Função para abrir modal de confirmação de exclusão
    function openDeleteDefModal(def) {
      setDeleteDefId(def.id_aliment_def);
    }

    // Função para deletar definição
    async function handleDeleteDefinicao() {
      setDeletingDef(true);
      setErrorDeleteDef("");
      try {
        await alimentacaoDefService.removerDefinicaoAlimentacao(deleteDefId);
        setDefinicoes((prev) => prev.filter(def => def.id_aliment_def !== deleteDefId));
        setDeleteDefId(null);
      } catch (err) {
        setErrorDeleteDef("Erro ao excluir definição. Tente novamente.");
      } finally {
        setDeletingDef(false);
      }
    }

    // Função para abrir modal de novo registro
    function openModalRegistro() {
      setModalRegistroOpen(true);
    }

    // Função para criar registro de alimentação
    async function handleCreateRegistro(e) {
      e.preventDefault();
      setSavingRegistro(true);
      setErrorRegistro("");
      // Validação dos campos obrigatórios
      if (!formRegistro.id_grupo || !formRegistro.id_aliment_def || !formRegistro.id_usuario || !formRegistro.quantidade || !formRegistro.unidade_medida) {
        setErrorRegistro("Preencha todos os campos obrigatórios.");
        setSavingRegistro(false);
        return;
      }
      try {
        const newRegistro = await alimentacaoRegistroService.criarRegistroAlimentacao({
          id_propriedade: id,
          id_grupo: formRegistro.id_grupo,
          id_aliment_def: formRegistro.id_aliment_def,
          id_usuario: formRegistro.id_usuario,
          quantidade: Number(formRegistro.quantidade),
          unidade_medida: formRegistro.unidade_medida,
          freq_dia: formRegistro.freq_dia ? Number(formRegistro.freq_dia) : undefined,
          dt_registro: formRegistro.dt_registro || new Date().toISOString()
        });
        setRegistros((prev) => [...prev, newRegistro]);
        setModalRegistroOpen(false);
        setFormRegistro({
          id_grupo: "",
          id_aliment_def: "",
          id_usuario: usuarioLogado ? usuarioLogado.id_usuario : "",
          quantidade: "",
          unidade_medida: "kg",
          freq_dia: "",
          dt_registro: ""
        });
      } catch (err) {
        setErrorRegistro("Erro ao criar registro. Verifique os campos.");
      } finally {
        setSavingRegistro(false);
      }
    }

    // Função para abrir modal de edição de registro
    function openEditRegistroModal(reg) {
      setEditRegistroId(reg.id_registro);
      setFormEditRegistro({
        quantidade: reg.quantidade || "",
        unidade_medida: reg.unidade_medida || "kg",
        freq_dia: reg.freq_dia || ""
      });
    }

    // Função para atualizar registro de alimentação
    async function handleEditRegistro(e) {
      e.preventDefault();
      setSavingEditRegistro(true);
      setErrorEditRegistro("");
      try {
        const updated = await alimentacaoRegistroService.atualizarRegistroAlimentacao(editRegistroId, {
          quantidade: formEditRegistro.quantidade ? Number(formEditRegistro.quantidade) : undefined,
          unidade_medida: formEditRegistro.unidade_medida,
          freq_dia: formEditRegistro.freq_dia ? Number(formEditRegistro.freq_dia) : undefined
        });
        setRegistros((prev) => prev.map(r => r.id_registro === editRegistroId ? updated : r));
        setEditRegistroId(null);
        setFormEditRegistro({ quantidade: "", unidade_medida: "kg", freq_dia: "" });
      } catch (err) {
        setErrorEditRegistro("Erro ao atualizar registro. Verifique os campos.");
      } finally {
        setSavingEditRegistro(false);
      }
    }

    // Função para abrir modal de confirmação de exclusão de registro
    function openDeleteRegistroModal(reg) {
      setDeleteRegistroId(reg.id_registro);
    }

    // Função para deletar registro
    async function handleDeleteRegistro() {
      setDeletingRegistro(true);
      setErrorDeleteRegistro("");
      try {
        await alimentacaoRegistroService.removerRegistroAlimentacao(deleteRegistroId);
        setRegistros((prev) => prev.filter(r => r.id_registro !== deleteRegistroId));
        setDeleteRegistroId(null);
      } catch (err) {
        setErrorDeleteRegistro("Erro ao excluir registro. Tente novamente.");
      } finally {
        setDeletingRegistro(false);
      }
    }

    return (
      <div className="flex flex-col gap-6">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Tipos de Ração</h2>
              <span className="text-xs font-medium text-[var(--color-primary-dark)]">Disponíveis</span>
            </div>
            <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">{tiposRacao}</p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Tipos cadastrados</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Consumo Diário</h2>
              <span className="text-xs font-medium text-[var(--color-primary-dark)]">Total</span>
            </div>
            <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">{consumoDiarioTotal.toFixed(1)}</p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">kg por dia</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Estoque Crítico</h2>
              <span className="text-xs font-medium text-red-600">Atenção</span>
            </div>
            <p className="text-4xl font-extrabold tracking-tight text-red-600">{estoqueCritico}</p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Item com estoque baixo</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Total de Registros</h2>
              <span className="text-xs font-medium text-[var(--color-primary-dark)]">Lançados</span>
            </div>
            <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">{totalRegistros}</p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Registros de alimentação</p>
          </div>
        </div>

        {/* Modal de nova definição */}
        {modalDefOpen && (
          <div className="fixed inset-0 z-[1004] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative flex flex-col gap-4 border border-[#e0e0e0]">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                onClick={() => setModalDefOpen(false)}
                aria-label="Fechar"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Nova Definição de Alimentação</h2>
              <form onSubmit={handleCreateDefinicao} className="flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Alimentação *</label>
                  <input
                    type="text"
                    required
                    value={formDef.tipo_alimentacao}
                    onChange={e => setFormDef(f => ({ ...f, tipo_alimentacao: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Ex: Concentrado, Volumoso, Suplemento Mineral"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={formDef.descricao}
                    onChange={e => setFormDef(f => ({ ...f, descricao: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Descrição detalhada do alimento"
                    rows={3}
                  />
                </div>
                {errorDef && <p className="text-red-600 text-sm">{errorDef}</p>}
                <button
                  type="submit"
                  className="bg-[#FFCF78] text-gray-800 px-4 py-2 rounded font-bold hover:bg-[#F2B84D] transition-colors"
                  disabled={savingDef}
                >
                  {savingDef ? "Salvando..." : "Salvar"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal de edição de definição */}
        {editDefId && (
          <div className="fixed inset-0 z-[1004] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative flex flex-col gap-4 border border-[#e0e0e0]">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                onClick={() => setEditDefId(null)}
                aria-label="Fechar"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Editar Definição de Alimentação</h2>
              <form onSubmit={handleEditDefinicao} className="flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Alimentação *</label>
                  <input
                    type="text"
                    required
                    value={formEditDef.tipo_alimentacao}
                    onChange={e => setFormEditDef(f => ({ ...f, tipo_alimentacao: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Ex: Concentrado, Volumoso, Suplemento Mineral"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={formEditDef.descricao}
                    onChange={e => setFormEditDef(f => ({ ...f, descricao: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Descrição detalhada do alimento"
                    rows={3}
                  />
                </div>
                {errorEditDef && <p className="text-red-600 text-sm">{errorEditDef}</p>}
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600 transition-colors"
                  disabled={savingEditDef}
                >
                  {savingEditDef ? "Salvando..." : "Salvar"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmação de exclusão */}
        {deleteDefId && (
          <div className="fixed inset-0 z-[1005] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative flex flex-col gap-4 border border-[#e0e0e0]">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                onClick={() => setDeleteDefId(null)}
                aria-label="Fechar"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Excluir Definição</h2>
              <p className="text-gray-700 mb-4">Tem certeza que deseja excluir esta definição de alimentação? Esta ação não pode ser desfeita.</p>
              {errorDeleteDef && <p className="text-red-600 text-sm">{errorDeleteDef}</p>}
              <div className="flex gap-3 mt-2">
                <button
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-300 transition-colors"
                  onClick={() => setDeleteDefId(null)}
                  disabled={deletingDef}
                >
                  Cancelar
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition-colors"
                  onClick={handleDeleteDefinicao}
                  disabled={deletingDef}
                >
                  {deletingDef ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de novo registro de alimentação */}
        {modalRegistroOpen && (
          <div className="fixed inset-0 z-[1006] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative flex flex-col gap-4 border border-[#e0e0e0]">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                onClick={() => setModalRegistroOpen(false)}
                aria-label="Fechar"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Novo Registro de Alimentação</h2>
              <form onSubmit={handleCreateRegistro} className="flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grupo *</label>
                  <select
                    required
                    value={formRegistro.id_grupo}
                    onChange={e => setFormRegistro(f => ({ ...f, id_grupo: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    disabled={loadingGrupos}
                  >
                    <option value="">Selecione o grupo</option>
                    {grupos.map(g => (
                      <option key={g.id_grupo} value={g.id_grupo}>{g.nome_grupo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Alimentação *</label>
                  <select
                    required
                    value={formRegistro.id_aliment_def}
                    onChange={e => setFormRegistro(f => ({ ...f, id_aliment_def: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Selecione o tipo</option>
                    {definicoes.map(def => (
                      <option key={def.id_aliment_def} value={def.id_aliment_def}>{def.tipo_alimentacao}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usuário *</label>
                  <input
                    type="text"
                    required
                    value={formRegistro.id_usuario}
                    readOnly
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-600"
                    placeholder="ID do usuário"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={formRegistro.quantidade}
                    onChange={e => setFormRegistro(f => ({ ...f, quantidade: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Quantidade"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Medida *</label>
                  <input
                    type="text"
                    required
                    value={formRegistro.unidade_medida}
                    onChange={e => setFormRegistro(f => ({ ...f, unidade_medida: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Ex: kg, g, L"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequência/Dia</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formRegistro.freq_dia}
                    onChange={e => setFormRegistro(f => ({ ...f, freq_dia: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Frequência por dia"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data do Registro</label>
                  <input
                    type="datetime-local"
                    value={formRegistro.dt_registro}
                    onChange={e => setFormRegistro(f => ({ ...f, dt_registro: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                {errorRegistro && <p className="text-red-600 text-sm">{errorRegistro}</p>}
                <button
                  type="submit"
                  className="bg-[#FFCF78] text-gray-800 px-4 py-2 rounded font-bold hover:bg-[#F2B84D] transition-colors"
                  disabled={savingRegistro}
                >
                  {savingRegistro ? "Salvando..." : "Salvar"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal de edição de registro de alimentação */}
        {editRegistroId && (
          <div className="fixed inset-0 z-[1007] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative flex flex-col gap-4 border border-[#e0e0e0]">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                onClick={() => setEditRegistroId(null)}
                aria-label="Fechar"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Editar Registro de Alimentação</h2>
              <form onSubmit={handleEditRegistro} className="flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formEditRegistro.quantidade}
                    onChange={e => setFormEditRegistro(f => ({ ...f, quantidade: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Quantidade"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Medida</label>
                  <input
                    type="text"
                    value={formEditRegistro.unidade_medida}
                    onChange={e => setFormEditRegistro(f => ({ ...f, unidade_medida: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Ex: kg, g, L"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequência/Dia</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formEditRegistro.freq_dia}
                    onChange={e => setFormEditRegistro(f => ({ ...f, freq_dia: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Frequência por dia"
                  />
                </div>
                {errorEditRegistro && <p className="text-red-600 text-sm">{errorEditRegistro}</p>}
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600 transition-colors"
                  disabled={savingEditRegistro}
                >
                  {savingEditRegistro ? "Salvando..." : "Salvar"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmação de exclusão de registro */}
        {deleteRegistroId && (
          <div className="fixed inset-0 z-[1008] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative flex flex-col gap-4 border border-[#e0e0e0]">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                onClick={() => setDeleteRegistroId(null)}
                aria-label="Fechar"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Excluir Registro de Alimentação</h2>
              <p className="text-gray-700 mb-4">Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.</p>
              {errorDeleteRegistro && <p className="text-red-600 text-sm">{errorDeleteRegistro}</p>}
              <div className="flex gap-3 mt-2">
                <button
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-300 transition-colors"
                  onClick={() => setDeleteRegistroId(null)}
                  disabled={deletingRegistro}
                >
                  Cancelar
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition-colors"
                  onClick={handleDeleteRegistro}
                  disabled={deletingRegistro}
                >
                  {deletingRegistro ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Definições de Alimentação */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-800">Definições de Alimentação</h2>
            <button
              className="bg-[#FFCF78] text-gray-800 px-4 py-2 rounded font-bold hover:bg-[#F2B84D] transition-colors"
              onClick={() => setModalDefOpen(true)}
            >
              Nova Definição
            </button>
          </div>
          {loadingDef ? (
            <p className="text-gray-500">Carregando...</p>
          ) : definicoes.length === 0 ? (
            <p className="text-gray-500">Nenhuma definição cadastrada.</p>
          ) : (
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Tipo</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Descrição</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Ações</th>
                </tr>
              </thead>
              <tbody>
                {definicoes.map((def) => (
                  <tr key={def.id_aliment_def} className="border-b border-gray-200">
                    <td className="p-3 text-center text-sm font-medium text-gray-800">{def.tipo_alimentacao}</td>
                    <td className="p-3 text-center text-sm text-gray-600">{def.descricao}</td>
                    <td className="p-3 text-center flex gap-2">
                      <button
                        className="bg-[#FCA90F] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#e6b866] transition-colors"
                        onClick={() => openEditDefModal(def)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-[#CE7D0A]  text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#FFCF78] transition-colors"
                        onClick={() => openDeleteDefModal(def)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Registros de Alimentação */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Registros de Alimentação</h2>
            <button
              className="bg-[#FFCF78] text-gray-800 px-4 py-2 rounded font-bold hover:bg-[#F2B84D] transition-colors"
              onClick={openModalRegistro}
            >
              Novo Registro
            </button>
          </div>
          {loadingReg ? (
            <p className="text-gray-500">Carregando...</p>
          ) : registros.length === 0 ? (
            <p className="text-gray-500">Nenhum registro encontrado.</p>
          ) : (
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Grupo</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Tipo</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Descrição</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Quantidade</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Frequência/Dia</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Usuário</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Data</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Ações</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((reg) => (
                  <tr key={reg.id_registro} className="border-b border-gray-200">
                    <td className="p-3 text-center text-sm font-medium text-gray-800">{reg.grupo?.nome_grupo || '-'}</td>
                    <td className="p-3 text-center text-sm text-gray-800">{reg.alimentacao_def?.tipo_alimentacao || '-'}</td>
                    <td className="p-3 text-center text-sm text-gray-600">{reg.alimentacao_def?.descricao || '-'}</td>
                    <td className="p-3 text-center text-sm text-gray-600">{reg.quantidade} {reg.unidade_medida}</td>
                    <td className="p-3 text-center text-sm text-gray-600">{reg.freq_dia}</td>
                    <td className="p-3 text-center text-sm text-gray-600">{reg.usuario?.nome || '-'}</td>
                    <td className="p-3 text-center text-sm text-gray-600">{reg.dt_registro ? new Date(reg.dt_registro).toLocaleDateString() : '-'}</td>
                    <td className="p-3 text-center flex gap-2">
                      <button
                        className="bg-[#FCA90F] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#e6b866] transition-colors"
                        onClick={() => openEditRegistroModal(reg)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-[#CE7D0A]  text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#FFCF78] transition-colors"
                        onClick={() => openDeleteRegistroModal(reg)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

       
        {/* Tabela de Alimentação */}
         {/* 
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Controle de Alimentação
            </h2>
            <p className="text-gray-600">
              Gestão de estoque e consumo de alimentos para os búfalos.
            </p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse min-w-[650px] bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    Tipo de Alimento
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    Quantidade em Estoque
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    Consumo Diário
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    Duração do Estoque
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    Status
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {alimentacaoMock.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 text-center">
                      <div className="text-sm font-medium text-gray-800">
                        {item.tipo}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="text-sm text-gray-600">{item.quantidade}</div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="text-sm text-gray-600">
                        {item.consumoDiario}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="text-sm text-gray-600">{item.estoque}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {formatStatus(item.status)}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="bg-[#FFCF78] text-gray-800 py-1 px-3 rounded text-xs font-bold hover:bg-[#F2B84D] transition-colors">
                          Reabastecer
                        </button>
                        <button className="bg-blue-500 text-white py-1 px-3 rounded text-xs font-bold hover:bg-blue-600 transition-colors">
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}

        
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          Detalhes da Propriedade {propriedade ? propriedade.nome : ""} | Buffs
        </title>
        <meta
          name="description"
          content="Visualize informações detalhadas da propriedade"
        />
      </Head>
      <div className="p-6 flex flex-col gap-8">
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          {/* Header principal */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Detalhes da Propriedade {propriedade ? propriedade.nome : ""}
            </h1>
            <p className="text-gray-600 text-lg">
              Visualize informações, lotes e alimentação da propriedade
              selecionada.
            </p>
          </div>
          {/* Navegação das abas */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("propriedade")}
              className={`py-2 px-4 rounded-lg text-sm font-bold transition-colors border ${
                activeTab === "propriedade"
                  ? "bg-[#FFCF78] text-gray-800 border-[#FFCF78]"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              Propriedade
            </button>
            <button
              onClick={() => setActiveTab("piquetes")}
              className={`py-2 px-4 rounded-lg text-sm font-bold transition-colors border ${
                activeTab === "piquetes"
                  ? "bg-[#FFCF78] text-gray-800 border-[#FFCF78]"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              Piquetes
            </button>
            <button
              onClick={() => setActiveTab("alimentacao")}
              className={`py-2 px-4 rounded-lg text-sm font-bold transition-colors border ${
                activeTab === "alimentacao"
                  ? "bg-[#FFCF78] text-gray-800 border-[#FFCF78]"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              Alimentação
            </button>
          </div>
          <div className="pt-2">
            {activeTab === "propriedade" && <PropriedadeTab />}
            {activeTab === "piquetes" && <PiquetesTab />}
            {activeTab === "alimentacao" && <AlimentacaoTab />}
          </div>
        </div>
      </div>
    </>
  );
}