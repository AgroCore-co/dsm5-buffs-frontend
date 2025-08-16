import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuth } from "@/hooks/useAuth";
import { useProperty } from "@/hooks/useProperty";
import loteService from "@/services/loteService";
import { Plus, Save, X, Edit3, Trash2, MapPin } from "lucide-react";

// Corrige o ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Componente auxiliar para atualizar a visualização do mapa
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Componente para capturar cliques no mapa durante o desenho
function MapClickHandler({ onMapClick, isDrawing }) {
  useMapEvents({
    click: (e) => {
      if (isDrawing && onMapClick) {
        onMapClick(e.latlng);
      }
    }
  });
  return null;
}

export default function MapaPiquetes() {
  const { getAccessToken } = useAuth();
  const { propriedadeSelecionada } = useProperty();
  
  // Estados para o mapa
  const [lotes, setLotes] = useState([]);
  const [center, setCenter] = useState([-24.738, -47.86]);
  const [zoom, setZoom] = useState(15);
  
  // Estados para criação/edição
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLote, setEditingLote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_lote: '',
    descricao: '',
    id_propriedade: propriedadeSelecionada?.id || 1
  });

  // Carrega os lotes da API
  useEffect(() => {
    const carregarLotes = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          console.error("❌ Token não disponível");
          return;
        }

        const lotesCarregados = await loteService.listarLotes(token);
        setLotes(lotesCarregados);

        // Calcula o centro médio de todos os piquetes
        if (lotesCarregados.length > 0) {
          let totalLat = 0;
          let totalLng = 0;
          let pointCount = 0;

          lotesCarregados.forEach(lote => {
            if (lote.geo_mapa?.coordinates) {
              const coordinates = lote.geo_mapa.coordinates[0];
              coordinates.forEach(([lng, lat]) => {
                totalLat += lat;
                totalLng += lng;
                pointCount++;
              });
            }
          });

          if (pointCount > 0) {
            const centerLat = totalLat / pointCount;
            const centerLng = totalLng / pointCount;
            setCenter([centerLat, centerLng]);
            setZoom(14);
          }
        }
      } catch (error) {
        console.error("❌ Erro ao carregar lotes:", error);
      }
    };

    if (propriedadeSelecionada) {
      carregarLotes();
    }
  }, [propriedadeSelecionada, getAccessToken]);

  // Funções de controle do desenho
  const iniciarDesenho = () => {
    setIsDrawing(true);
    setDrawingPoints([]);
    setShowForm(false);
    setEditingLote(null);
    setFormData({
      nome_lote: '',
      descricao: '',
      id_propriedade: propriedadeSelecionada?.id || 1
    });
  };

  const cancelarDesenho = () => {
    setIsDrawing(false);
    setDrawingPoints([]);
    setShowForm(false);
    setEditingLote(null);
    setFormData({
      nome_lote: '',
      descricao: '',
      id_propriedade: propriedadeSelecionada?.id || 1
    });
  };

  const finalizarDesenho = () => {
    if (drawingPoints.length < 3) {
      alert('É necessário pelo menos 3 pontos para formar um piquete!');
      return;
    }
    
    setIsDrawing(false);
    setShowForm(true);
  };

  const handleMapClick = (latlng) => {
    if (isDrawing) {
      setDrawingPoints(prev => [...prev, [latlng.lat, latlng.lng]]);
    }
  };

  // Função para salvar o piquete (nova ou editada)
  const salvarPiquete = async () => {
    if (!formData.nome_lote.trim()) {
      alert('Nome do piquete é obrigatório!');
      return;
    }

    setLoading(true);
    
    try {
      // Prepara as coordenadas
      const coordenadasFechadas = [...drawingPoints, drawingPoints[0]];
      const geoJsonCoordinates = coordenadasFechadas.map(([lat, lng]) => [lng, lat]);
      
      const dadosPiquete = {
        nome_lote: formData.nome_lote,
        descricao: formData.descricao || null,
        id_propriedade: formData.id_propriedade,
        geo_mapa: {
          type: "Polygon",
          coordinates: [geoJsonCoordinates]
        }
      };

      const token = await getAccessToken();
      
      if (editingLote) {
        // Lógica para atualizar piquete existente (implementar no service)
        // const piqueteAtualizado = await loteService.atualizarLote(editingLote.id_lote, dadosPiquete, token);
        console.log("Atualizando piquete:", dadosPiquete);
      } else {
        // Criar novo piquete
        const novoPiquete = await loteService.criarLote(dadosPiquete, token);
        setLotes(prev => [...prev, novoPiquete]);
      }

      // Reset do formulário
      cancelarDesenho();
      alert(editingLote ? 'Piquete atualizado com sucesso!' : 'Piquete criado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao salvar piquete:', error);
      alert('Erro ao salvar piquete. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar piquete
  const deletarPiquete = async (lote) => {
    if (!confirm(`Tem certeza que deseja deletar o piquete "${lote.nome_lote}"?`)) {
      return;
    }

    try {
      const token = await getAccessToken();
      // Implementar no service: await loteService.deletarLote(lote.id_lote, token);
      
      setLotes(prev => prev.filter(l => l.id_lote !== lote.id_lote));
      alert('Piquete deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar piquete:', error);
      alert('Erro ao deletar piquete. Tente novamente.');
    }
  };

  // Função para iniciar edição de um piquete
  const iniciarEdicao = (lote) => {
    setEditingLote(lote);
    setFormData({
      nome_lote: lote.nome_lote,
      descricao: lote.descricao || '',
      id_propriedade: lote.id_propriedade
    });
    
    // Converte coordenadas para o formato do drawing
    if (lote.geo_mapa?.coordinates) {
      const coordinates = lote.geo_mapa.coordinates[0];
      const points = coordinates.slice(0, -1).map(([lng, lat]) => [lat, lng]); // Remove o último ponto (fechamento)
      setDrawingPoints(points);
    }
    
    setShowForm(true);
  };

  return (
    <div className="w-full">
      {/* Barra de ferramentas */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FFCF78] rounded-lg">
            <MapPin className="w-5 h-5 text-[#CE7D0A]" />
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {lotes.length === 0 
                ? "Nenhum piquete cadastrado" 
                : `${lotes.length} piquete${lotes.length !== 1 ? 's' : ''} encontrado${lotes.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {!isDrawing && !showForm && (
            <button
              onClick={iniciarDesenho}
              className="flex items-center gap-2 bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus size={16} />
              Novo Piquete
            </button>
          )}
          
          {isDrawing && (
            <div className="flex gap-2">
              <button
                onClick={finalizarDesenho}
                disabled={drawingPoints.length < 3}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Save size={16} />
                Finalizar ({drawingPoints.length} pontos)
              </button>
              <button
                onClick={cancelarDesenho}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <X size={16} />
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Instruções durante o desenho */}
      {isDrawing && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-blue-800 font-medium">Criando novo piquete</p>
              <p className="text-blue-700 text-sm mt-1">
                Clique no mapa para adicionar pontos. Mínimo de 3 pontos necessários.
                {drawingPoints.length > 0 && ` Você já adicionou ${drawingPoints.length} ponto${drawingPoints.length !== 1 ? 's' : ''}.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Container do mapa */}
      <div className="w-full h-[400px] mb-4 rounded-lg overflow-hidden shadow-sm border border-gray-200">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
        >
          <ChangeView center={center} zoom={zoom} />
          <MapClickHandler onMapClick={handleMapClick} isDrawing={isDrawing} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Renderiza piquetes existentes */}
          {lotes.map((lote) => {
            if (!lote.geo_mapa?.coordinates) return null;
            
            const coordinates = lote.geo_mapa.coordinates[0].map(([lng, lat]) => [lat, lng]);
            
            return (
              <div key={lote.id_lote}>
                <Polygon
                  positions={coordinates}
                  pathOptions={{
                    color: editingLote?.id_lote === lote.id_lote ? '#3B82F6' : '#CE7D0A',
                    weight: editingLote?.id_lote === lote.id_lote ? 3 : 2,
                    fillColor: editingLote?.id_lote === lote.id_lote ? '#3B82F6' : '#FFCF78',
                    fillOpacity: editingLote?.id_lote === lote.id_lote ? 0.3 : 0.4
                  }}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <h4 className="font-bold text-lg mb-1">{lote.nome_lote}</h4>
                      {lote.descricao && (
                        <p className="text-sm text-gray-600 mb-3">{lote.descricao}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => iniciarEdicao(lote)}
                          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          <Edit3 size={12} />
                          Editar
                        </button>
                        <button
                          onClick={() => deletarPiquete(lote)}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          <Trash2 size={12} />
                          Deletar
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              </div>
            );
          })}
          
          {/* Renderiza pontos durante o desenho */}
          {isDrawing && drawingPoints.map((point, index) => (
            <Marker key={index} position={point}>
              <Popup>
                <div className="text-center">
                  <p className="font-medium">Ponto {index + 1}</p>
                  <p className="text-xs text-gray-600">
                    Lat: {point[0].toFixed(6)}<br />
                    Lng: {point[1].toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Renderiza polígono temporário durante o desenho */}
          {(isDrawing || showForm) && drawingPoints.length >= 3 && (
            <Polygon
              positions={drawingPoints}
              pathOptions={{
                color: '#3B82F6',
                weight: 2,
                fillColor: '#3B82F6',
                fillOpacity: 0.2,
                dashArray: '5, 10'
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Formulário para criar/editar piquete */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            {editingLote ? (
              <>
                <Edit3 size={20} className="text-blue-500" />
                Editar Piquete
              </>
            ) : (
              <>
                <Plus size={20} className="text-[#CE7D0A]" />
                Novo Piquete
              </>
            )}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Piquete *
              </label>
              <input
                type="text"
                value={formData.nome_lote}
                onChange={(e) => setFormData(prev => ({ ...prev, nome_lote: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCF78] focus:border-transparent"
                placeholder="Ex: Piquete Norte A"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (Opcional)
              </label>
              <input
                type="text"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCF78] focus:border-transparent"
                placeholder="Descrição do piquete"
                disabled={loading}
              />
            </div>
          </div>

          {/* Informações sobre a área desenhada */}
          {drawingPoints.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Informações da Área</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Pontos definidos:</span>
                  <span className="font-medium ml-2">{drawingPoints.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium ml-2 text-green-600">
                    {drawingPoints.length >= 3 ? 'Válido' : 'Mínimo 3 pontos'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <button
              onClick={cancelarDesenho}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={salvarPiquete}
              disabled={loading || drawingPoints.length < 3}
              className="flex items-center gap-2 bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {editingLote ? 'Atualizar Piquete' : 'Salvar Piquete'}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Lista compacta de piquetes (opcional - pode ser removida se já existe na página principal) */}
      {!showForm && lotes.length > 0 && (
        <div className="mt-4 bg-white rounded-lg shadow border border-gray-200 p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Piquetes Cadastrados ({lotes.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lotes.slice(0, 6).map((lote) => (
              <div 
                key={lote.id_lote} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-gray-800 truncate">{lote.nome_lote}</h5>
                  {lote.descricao && (
                    <p className="text-xs text-gray-600 truncate">{lote.descricao}</p>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => iniciarEdicao(lote)}
                    className="p-1 text-blue-500 hover:bg-blue-100 rounded transition-colors"
                    title="Editar piquete"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => deletarPiquete(lote)}
                    className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                    title="Deletar piquete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {lotes.length > 6 && (
            <div className="text-center mt-3">
              <button className="text-sm text-[#CE7D0A] hover:text-[#F2B84D] font-medium">
                Ver todos os {lotes.length} piquetes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}