"use client";

import { useEffect, useState } from "react";
import { usePropriedade } from "@/contexts/propriedadeContext";
import dashboardService from "@/services/dashboardService";
import bufaloService from "@/services/bufaloService";
import dadosSanitariosService from "@/services/dadosSanitariosService";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, XAxis, YAxis, Bar } from "recharts";
import BuffaloModal from "@/components/proprietario/rebanho/prontuarioModal";
import CriarBufaloModal from "@/components/proprietario/rebanho/CriarBufaloModal";
import GerarRelatorioModal from "@/components/proprietario/relatorios/GerarRelatorioModal";
import BuffaloTable from "@/components/proprietario/rebanho/BuffaloTable";

export default function Rebanho() {
	// obter id da propriedade via context
	const { propriedadeId } = usePropriedade();

	// estado para dados do dashboard
	const [dashboardStats, setDashboardStats] = useState(null);
	const [loadingStats, setLoadingStats] = useState(false);

	// búfalos / paginação
	const [bufalos, setBufalos] = useState([]);
	const [metaBufalos, setMetaBufalos] = useState(null);
	const [loadingBufalos, setLoadingBufalos] = useState(false);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [modalOpen, setModalOpen] = useState(false);
	const [bufaloSelecionado, setBufaloSelecionado] = useState(null);
	const [modalCriarBufaloOpen, setModalCriarBufaloOpen] = useState(false);
	const [modalRelatorioOpen, setModalRelatorioOpen] = useState(false);

	// frequência de doenças
	const [frequenciaDoencas, setFrequenciaDoencas] = useState([]);
	const [loadingDoencas, setLoadingDoencas] = useState(false);

	useEffect(() => {
		if (!propriedadeId) {
			setDashboardStats(null);
			return;
		}
		let ignore = false;
		(async () => {
			setLoadingStats(true);
			try {
				const data = await dashboardService.getDashboardStatsByPropriedadeId(propriedadeId);
				if (!ignore) setDashboardStats(data || null);
			} catch (e) {
				if (!ignore) setDashboardStats(null);
			} finally {
				if (!ignore) setLoadingStats(false);
			}
		})();
		return () => { ignore = true; };
	}, [propriedadeId]);

	// buscar búfalos da propriedade (paginação)
	useEffect(() => {
		if (!propriedadeId) {
			setBufalos([]);
			setMetaBufalos(null);
			return;
		}
		let ignore = false;
		(async () => {
			setLoadingBufalos(true);
			try {
				const res = await bufaloService.listarBufalosPorPropriedade(propriedadeId, page, limit);
				if (ignore) return;
				// res deve ter formato: { data: [...], meta: {...} }
				setBufalos(Array.isArray(res?.data) ? res.data : []);
				setMetaBufalos(res?.meta ?? null);
			} catch (err) {
				if (!ignore) {
					setBufalos([]);
					setMetaBufalos(null);
				}
			} finally {
				if (!ignore) setLoadingBufalos(false);
			}
		})();
		return () => { ignore = true; };
	}, [propriedadeId, page, limit]);

	// buscar frequência de doenças
	useEffect(() => {
		if (!propriedadeId) return;
		let ignore = false;
		(async () => {
			setLoadingDoencas(true);
			try {
				const data = await dadosSanitariosService.obterFrequenciaDoencasPorPropriedade(propriedadeId);
				if (!ignore) setFrequenciaDoencas(data.dados || []);
			} catch (e) {
				if (!ignore) setFrequenciaDoencas([]);
			} finally {
				if (!ignore) setLoadingDoencas(false);
			}
		})();
		return () => { ignore = true; };
	}, [propriedadeId]);

	// helpers para exibir valores com fallback
	const totalAtivos =
		(dashboardStats?.qtd_macho_ativos ?? 0) + (dashboardStats?.qtd_femeas_ativas ?? 0);
	const femeasAtivas = dashboardStats?.qtd_femeas_ativas ?? null;
	const machosAtivos = dashboardStats?.qtd_macho_ativos ?? null;
	const lactando = (dashboardStats?.qtd_bufalas_lactando ?? null) ?? dashboardStats?.qtd_bufalos_vaca ?? null;

	const pct = (value, total) =>
		total > 0 && value != null ? `${Math.round((value / total) * 100)}% do rebanho` : "0% do rebanho";

	// dados de maturidade para o gráfico (vêm do endpoint)
	const maturidadeData = [
		{ name: "Bezerros", value: dashboardStats?.qtd_bufalos_bezerro ?? 0, color: "#FCA90F" },
		{ name: "Novilhas", value: dashboardStats?.qtd_bufalos_novilha ?? 0, color: "#FFCF78" },
		{ name: "Vacas", value: dashboardStats?.qtd_bufalos_vaca ?? 0, color: "#CE7D0A" },
		{ name: "Touros", value: dashboardStats?.qtd_bufalos_touro ?? 0, color: "#F2B84D" },
	];

	// dados de sexo para o gráfico (vêm do endpoint)
	const sexData = [
		{ name: "Fêmeas", value: dashboardStats?.qtd_femeas_ativas ?? 0, color: "#FFCF78" },
		{ name: "Machos", value: dashboardStats?.qtd_macho_ativos ?? 0, color: "#CE7D0A" },
	];

	return (
		<div className="p-6 flex flex-col gap-8">
			{/* Header - Gestão do Rebanho */}
			<div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
				<div>
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						Gestão do Rebanho
					</h1>
					<p className="text-gray-600 text-lg">
						Gerencie seu rebanho de búfalos, registre informações zootécnicas e sanitárias.
					</p>
				</div>

				{/* Resumo do Rebanho */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
						<div className="flex items-center justify-between mb-1">
							<h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
								Total do Rebanho
							</h2>
							<span className="text-xs font-medium text-[var(--color-primary-dark]">
								Ativos
							</span>
						</div>
						<p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark]">
							{loadingStats ? "-" : (totalAtivos || "-")}
						</p>
						<p className="text-xs text-[var(--color-text-tertiary)] mt-1">
							{loadingStats ? "Carregando..." : "Búfalos ativos no sistema"}
						</p>
					</div>

					<div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
						<div className="flex items-center justify-between mb-1">
							<h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Fêmeas</h2>
							<span className="text-xs font-medium text-[var(--color-primary-dark)]">Percentual</span>
						</div>
						<p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
							{loadingStats ? "-" : (femeasAtivas ?? "-")}
						</p>
						<p className="text-sm font-semibold text-[var(--color-primary-dark)] mt-1">
							{loadingStats ? "-" : (femeasAtivas != null ? pct(femeasAtivas, totalAtivos) : "0% do rebanho")}
						</p>
					</div>

					<div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
						<div className="flex items-center justify-between mb-1">
							<h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Machos</h2>
							<span className="text-xs font-medium text-[var(--color-primary-dark)]">Percentual</span>
						</div>
						<p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
							{loadingStats ? "-" : (machosAtivos ?? "-")}
						</p>
						<p className="text-sm font-semibold text-[var(--color-primary-dark)] mt-1">
							{loadingStats ? "-" : (machosAtivos != null ? pct(machosAtivos, totalAtivos) : "0% do rebanho")}
						</p>
					</div>

					<div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
						<div className="flex items-center justify-between mb-1">
							<h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Vacas Produtoras</h2>
							<span className="text-xs font-medium text-[var(--color-primary-dark)]">Ativas</span>
						</div>
						<p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
							{loadingStats ? "-" : (lactando ?? "-")}
						</p>
						<p className="text-sm font-medium text-[var(--color-text-tertiary)] mt-1">
							Em lactação
						</p>
					</div>
				</div>
			</div>

			{/* Gráficos de Análise (placeholders visuais) */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="bg-white rounded-xl p-5 border border-[#e0e0e0] shadow-sm">
					<h2 className="text-lg font-semibold text-gray-800 mb-4">Distribuição por Maturidade</h2>
					<div className="flex flex-col items-center justify-center h-[160px] text-center">
						{loadingStats ? (
							<p className="text-gray-400 text-sm mt-6">Carregando dados...</p>
						) : !dashboardStats ? (
							<p className="text-gray-400 text-sm mt-6">Nenhum dado disponível</p>
						) : (
							<ResponsiveContainer width="100%" height={160}>
								<PieChart>
									<Pie
										data={maturidadeData}
										dataKey="value"
										nameKey="name"
										cx="50%"
										cy="50%"
										outerRadius={60}
										label={({ name, value }) => (value > 0 ? `${name}: ${value}` : "")}
									>
										{maturidadeData.map((entry, index) => (
											<Cell key={`cell-mat-${index}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip formatter={(value) => [`${value}`, "Quantidade"]} />
								</PieChart>
							</ResponsiveContainer>
						)}
					</div>
				</div>

				<div className="bg-white rounded-xl p-5 border border-[#e0e0e0] shadow-sm">
					<h2 className="text-lg font-semibold text-gray-800 mb-4">Distribuição por Sexo</h2>
					<div className="flex flex-col items-center justify-center h-[160px] text-center">
						{loadingStats ? (
							<p className="text-gray-400 text-sm mt-6">Carregando dados...</p>
						) : !dashboardStats ? (
							<p className="text-gray-400 text-sm mt-6">Nenhum dado disponível</p>
						) : (
							<ResponsiveContainer width="100%" height={160}>
								<PieChart>
									<Pie
										data={sexData}
										dataKey="value"
										nameKey="name"
										cx="50%"
										cy="50%"
										outerRadius={60}
										label={({ name, value }) => (value > 0 ? `${name}: ${value}` : "")}
									>
										{sexData.map((entry, index) => (
											<Cell key={`cell-sex-${index}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip formatter={(value) => [`${value}`, "Quantidade"]} />
								</PieChart>
							</ResponsiveContainer>
						)}
					</div>
				</div>

				<div className="bg-white rounded-xl p-5 border border-[#e0e0e0] shadow-sm">
					<h2 className="text-lg font-semibold text-gray-800 mb-4">Distribuição por Raça</h2>
					<div className="flex flex-col items-center justify-center h-[160px] text-center">
						{loadingStats ? (
							<p className="text-gray-400 text-sm mt-6">Carregando dados...</p>
						) : !dashboardStats ? (
							<p className="text-gray-400 text-sm mt-6">Nenhum dado disponível</p>
						) : (
							<ResponsiveContainer width="100%" height={160}>
								<PieChart>
									<Pie
										data={dashboardStats.bufalosPorRaca || []}
										dataKey="quantidade"
										nameKey="raca"
										cx="50%"
										cy="50%"
										outerRadius={60}
										label={({ name, value }) => (value > 0 ? `${name}: ${value}` : "")}
									>
										{(dashboardStats.bufalosPorRaca || []).map((entry, index) => (
											<Cell key={`cell-raca-${index}`} fill={["#FCA90F", "#FFCF78", "#CE7D0A", "#F2B84D"][index % 4]} />
										))}
									</Pie>
									<Tooltip formatter={(value) => [`${value}`, "Quantidade"]} />
								</PieChart>
							</ResponsiveContainer>
						)}
					</div>
				</div>
			</div>

			{/* Tabela de Búfalos com Filtros (apenas visual) */}
			<BuffaloTable
				setModalOpen={setModalOpen}
				setBufaloSelecionado={setBufaloSelecionado}
				setModalCriarBufaloOpen={setModalCriarBufaloOpen}
				setModalRelatorioOpen={setModalRelatorioOpen}
			/>

			{/* Gráfico de Frequência de Doenças */}
			<div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[var(--color-border-primary)] shadow-sm">
				<h2 className="text-2xl font-bold text-[var(--color-text-dark)]">Frequência de Doenças</h2>
				{loadingDoencas ? (
					<p className="text-[var(--color-text-tertiary)]">Carregando dados...</p>
				) : frequenciaDoencas.length === 0 ? (
					<p className="text-[var(--color-text-tertiary)]">Nenhum dado disponível</p>
				) : (
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={frequenciaDoencas} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
							<XAxis dataKey="doenca" stroke="var(--color-text-secondary)" />
							<YAxis stroke="var(--color-text-secondary)" />
							<Tooltip contentStyle={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border-primary)' }} />
							<Bar dataKey="frequencia" fill="var(--color-primary)" />
						</BarChart>
					</ResponsiveContainer>
				)}
			</div>
		<BuffaloModal open={modalOpen} onClose={() => setModalOpen(false)} idBufalo={bufaloSelecionado} />
		<CriarBufaloModal
			open={modalCriarBufaloOpen}
			onClose={() => setModalCriarBufaloOpen(false)}
			propriedadeId={propriedadeId}
			onSuccess={() => {
				// Atualizar lista de búfalos após criar um novo
				setPage(1); // Reinicia a paginação para carregar a lista atualizada
			}}
		/>
		<GerarRelatorioModal
			open={modalRelatorioOpen}
			onClose={() => setModalRelatorioOpen(false)}
			propriedadeId={propriedadeId}
			propriedadeNome={bufalos[0]?.propriedade?.nome || "Propriedade"}
		/>
	</div>
	);
}