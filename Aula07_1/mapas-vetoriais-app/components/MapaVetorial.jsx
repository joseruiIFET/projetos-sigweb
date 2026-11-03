"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Centro aproximado de Minas Gerais: [latitude, longitude]
const CENTRO_MINAS_GERAIS = [-18.58, -45.45];

const ESTILO_MUNICIPIO = {
    color: "#38bdf8",
    weight: 1,
    opacity: 0.95,
    fillColor: "#38bdf8",
    fillOpacity: 0.12,
};

const ESTILO_DESTAQUE = {
    weight: 3,
    fillOpacity: 0.35,
};

function estiloBotaoCamada(ativo) {
    return {
        padding: "6px 12px",
        borderRadius: 6,
        border: "none",
        fontSize: 12,
        fontWeight: "bold",
        cursor: "pointer",
        background: ativo ? "#0284c7" : "transparent",
        color: ativo ? "#ffffff" : "#94a3b8",
    };
}

export default function MapaVetorial({ onSelecionarMunicipio }) {
    const [dadosVetor, setDadosVetor] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [tipoCamada, setTipoCamada] = useState("satelite");

    // Faz o pedido do arquivo uma única vez, quando o mapa aparece na tela
    useEffect(() => {
        fetch("/municipios-mg.geojson")
            .then((resposta) => {
                if (!resposta.ok) {
                    throw new Error(`Falha ao baixar o GeoJSON: HTTP ${resposta.status}`);
                }
                return resposta.json();
            })
            .then((dados) => {
                setDadosVetor(dados);
            })
            .catch((erro) => {
                console.error("Erro ao carregar o GeoJSON:", erro);
            })
            .finally(() => {
                setCarregando(false);
            });
    }, []);

    // O Leaflet chama esta função uma vez para cada município do GeoJSON
    function aoConfigurarFeicao(feature, layer) {
        const atributos = feature.properties;

        const conteudoPopup = `
            <div style="font-family: system-ui, sans-serif; min-width: 200px; color: #0f172a;">
                <h4 style="margin: 0 0 6px 0; color: #0284c7; font-size: 15px;">${atributos.NM_MUN}</h4>
                <p style="margin: 2px 0; font-size: 12px;"><strong>Região imediata:</strong> ${atributos.NM_RGI}</p>
                <p style="margin: 2px 0; font-size: 12px;"><strong>Região intermediária:</strong> ${atributos.NM_RGINT}</p>
                <p style="margin: 2px 0; font-size: 12px;"><strong>Área:</strong> ${atributos.AREA_KM2.toLocaleString("pt-BR")} km²</p>
                <p style="margin: 2px 0; font-size: 12px;"><strong>Código IBGE:</strong> ${atributos.CD_MUN}</p>
            </div>
        `;

        layer.bindPopup(conteudoPopup);

        layer.on({
            mouseover: () => layer.setStyle(ESTILO_DESTAQUE),
            mouseout: () => layer.setStyle(ESTILO_MUNICIPIO),
            click: () => onSelecionarMunicipio(atributos),
        });
    }

    return (
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid #334155" }}>
            {/* Alternador do mapa de fundo */}
            <div style={{ position: "absolute", top: 12, right: 12, zIndex: 1000, background: "rgba(15, 23, 42, 0.9)", border: "1px solid #334155", borderRadius: 8, padding: 4, display: "flex", gap: 4 }}>
                <button type="button" onClick={() => setTipoCamada("satelite")} style={estiloBotaoCamada(tipoCamada === "satelite")}>
                    Satélite
                </button>
                <button type="button" onClick={() => setTipoCamada("ruas")} style={estiloBotaoCamada(tipoCamada === "ruas")}>
                    Ruas
                </button>
            </div>

            {carregando && (
                <div style={{ position: "absolute", top: 12, left: 56, zIndex: 1000, background: "rgba(15, 23, 42, 0.85)", color: "#38bdf8", padding: "6px 12px", borderRadius: 6, fontSize: 12, border: "1px solid #334155" }}>
                    Carregando GeoJSON...
                </div>
            )}

            <MapContainer center={CENTRO_MINAS_GERAIS} zoom={6} style={{ height: "100%", width: "100%" }}>
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

                {dadosVetor && (
                    <GeoJSON
                        data={dadosVetor}
                        style={ESTILO_MUNICIPIO}
                        onEachFeature={aoConfigurarFeicao}
                    />
                )}
            </MapContainer>
        </div>
    );
}
