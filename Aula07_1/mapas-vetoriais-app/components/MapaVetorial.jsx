"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correção padrão dos ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/**
 * Componente fantasma para recentralizar o mapa suavemente
 */
function ControladorCamera({ centro, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (centro) {
      map.flyTo(centro, zoom || 13, { animate: true, duration: 1.2 });
    }
  }, [centro, zoom, map]);

  return null;
}

export default function MapaVetorial({ onSelecionarTrecho, centroAlvo }) {
  const [dadosVetor, setDadosVetor] = useState(null);
  const [tipoCamada, setTipoCamada] = useState("satelite");
  const [carregando, setCarregando] = useState(true);

  // Carrega o arquivo GeoJSON estático servido pela pasta public/
  useEffect(() => {
    fetch("/hidrografia.geojson")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao baixar o arquivo GeoJSON");
        return res.json();
      })
      .then((dados) => {
        setDadosVetor(dados);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro no carregamento do GeoJSON:", err);
        setCarregando(false);
      });
  }, []);

  /**
   * onEachFeature: executada pelo Leaflet para CADA linha/polígono no GeoJSON.
   * Conecta a Tabela de Atributos (properties) ao balão Popup (Callout na Web).
   */
  const aoConfigurarFeicao = (feature, layer) => {
    if (!feature.properties) return;
    const p = feature.properties;

    // 1. Popup formatado (HTML renderizado no clique)
    const popupHtml = `
      <div style="font-family: system-ui, sans-serif; min-width: 200px; color: #0f172a;">
        <h4 style="margin: 0 0 6px 0; color: #0284c7; font-size: 15px; border-bottom: 2px solid #bae6fd; padding-bottom: 4px;">
          💧 ${p.NOME || "Trecho sem nome"}
        </h4>
        <div style="font-size: 12px; line-height: 1.6;">
          <p style="margin: 2px 0;"><strong>Bacia:</strong> ${p.BACIA || "-"}</p>
          <p style="margin: 2px 0;"><strong>Domínio:</strong> ${p.DOMINIO || "-"}</p>
          <p style="margin: 2px 0;"><strong>Classe:</strong> ${p.CLASSE_USO || "Não classificado"}</p>
          <p style="margin: 2px 0;"><strong>Extensão:</strong> ${p.EXTENSAO_KM ? p.EXTENSAO_KM + " km" : "-"}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 6px 0;" />
          <p style="margin: 2px 0;"><strong>Vazão Média:</strong> ${p.VAZAO_MED} m³/s</p>
          <p style="margin: 2px 0; color: #dc2626;"><strong>Q7,10 (Mínima):</strong> ${p.Q7_10} m³/s</p>
        </div>
      </div>
    `;

    layer.bindPopup(popupHtml);

    // 2. Interatividade visual ao passar o mouse e ao clicar
    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({ weight: 7, color: "#7dd3fc" });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle({ weight: 4, color: "#38bdf8" });
      },
      click: () => {
        if (onSelecionarTrecho) {
          onSelecionarTrecho(p);
        }
      },
    });
  };

  // Coordenada central padrão (região dos rios amostrais em Minas Gerais)
  const centroPadrao = [-21.2650, -43.1650];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid #334155" }}>
      {/* Barra de Controles sobre o Mapa */}
      <div style={{ position: "absolute", top: 12, right: 12, zIndex: 1000, display: "flex", gap: 6 }}>
        <div style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid #334155", borderRadius: 8, padding: 4, display: "flex", gap: 4 }}>
          <button
            type="button"
            onClick={() => setTipoCamada("satelite")}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              fontSize: 12,
              fontWeight: "bold",
              cursor: "pointer",
              background: tipoCamada === "satelite" ? "#0284c7" : "transparent",
              color: tipoCamada === "satelite" ? "#ffffff" : "#94a3b8",
            }}
          >
            🛰️ Satélite
          </button>
          <button
            type="button"
            onClick={() => setTipoCamada("ruas")}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              fontSize: 12,
              fontWeight: "bold",
              cursor: "pointer",
              background: tipoCamada === "ruas" ? "#0284c7" : "transparent",
              color: tipoCamada === "ruas" ? "#ffffff" : "#94a3b8",
            }}
          >
            🗺️ Ruas
          </button>
        </div>
      </div>

      {carregando && (
        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 1000, background: "rgba(15, 23, 42, 0.85)", color: "#38bdf8", padding: "6px 12px", borderRadius: 6, fontSize: 12, border: "1px solid #334155" }}>
          ⏳ Carregando GeoJSON...
        </div>
      )}

      <MapContainer
        center={centroPadrao}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        {tipoCamada === "satelite" ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; ESRI World Imagery"
            maxZoom={19}
          />
        ) : (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
            maxZoom={19}
          />
        )}

        {/* Camada Vetorial GeoJSON com Tabela de Atributos */}
        {dadosVetor && (
          <GeoJSON
            data={dadosVetor}
            onEachFeature={aoConfigurarFeicao}
            style={{
              color: "#38bdf8",
              weight: 4,
              opacity: 0.95,
            }}
          />
        )}

        <ControladorCamera centro={centroAlvo} zoom={13} />
      </MapContainer>
    </div>
  );
}
