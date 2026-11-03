"use client";

import { useState, useMemo } from "react";
import { haversine, formatarDistancia } from "../lib/geodesia";
import styles from "./page.module.css";

export default function Home() {
    const [pontoA, setPontoA] = useState(null);
    const [pontoB, setPontoB] = useState(null);
    const [alvo, setAlvo] = useState("A");
    const [buscando, setBuscando] = useState(false);
    const [erro, setErro] = useState(null);

    // Lê o GPS do dispositivo e grava no marco selecionado (Ponto A ou Ponto B)
    function capturarPontoGPS() {
        if (!navigator.geolocation) {
            setErro("Este navegador não possui suporte à Geolocation API.");
            return;
        }

        setBuscando(true);
        setErro(null);

        function callbackSucesso(posicao) {
            const coords = posicao.coords;
            const novoPonto = {
                latitude: coords.latitude,
                longitude: coords.longitude,
                precisao: coords.accuracy,
                horario: new Date(posicao.timestamp).toLocaleTimeString("pt-BR"),
            };

            if (alvo === "A") {
                setPontoA(novoPonto);
                setAlvo("B"); // avança automaticamente a seleção para o Ponto B
            } else {
                setPontoB(novoPonto);
            }
            setBuscando(false);
        }

        function callbackErro(erroHardware) {
            setErro(`Falha ao ler o GPS (código ${erroHardware.code}): ${erroHardware.message}`);
            setBuscando(false);
        }

        const opcoesConfig = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        };

        navigator.geolocation.getCurrentPosition(callbackSucesso, callbackErro, opcoesConfig);
    }

    function limparPontos() {
        setPontoA(null);
        setPontoB(null);
        setAlvo("A");
        setErro(null);
    }

    // Cálculo reativo da distância com useMemo: só recalcula quando pontoA ou pontoB mudam
    const distancia = useMemo(() => {
        if (!pontoA || !pontoB) return null;

        return haversine(
            pontoA.latitude,
            pontoA.longitude,
            pontoB.latitude,
            pontoB.longitude
        );
    }, [pontoA, pontoB]);

    // Monta a URL do OpenStreetMap enquadrando os pontos coletados
    function montarUrlMapa() {
        const pontos = [pontoA, pontoB].filter(Boolean);
        if (pontos.length === 0) return null;

        const lats = pontos.map((p) => p.latitude);
        const lons = pontos.map((p) => p.longitude);
        const minLat = Math.min(...lats) - 0.002;
        const maxLat = Math.max(...lats) + 0.002;
        const minLon = Math.min(...lons) - 0.002;
        const maxLon = Math.max(...lons) + 0.002;

        const pino = pontoB || pontoA;
        return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon},${minLat},${maxLon},${maxLat}&layer=mapnik&marker=${pino.latitude},${pino.longitude}`;
    }

    return (
        <main className={styles.container}>
            {/* 1. Cabeçalho */}
            <header className={styles.cabecalho}>
                <span className={styles.tagDisciplina}>SIG-Web • Aula 05.1</span>
                <h1 className={styles.titulo}>Medidor de Distância GPS</h1>
                <p className={styles.subtitulo}>
                    Cálculo da distância geodésica entre dois pontos usando a Fórmula de Haversine (Prof. José Rui).
                </p>
            </header>

            {/* 2. Botões de Ação */}
            <div className={styles.botoesGrid}>
                <button
                    type="button"
                    onClick={capturarPontoGPS}
                    disabled={buscando}
                    className={styles.btnAcao}
                >
                    {buscando ? "Lendo GPS..." : `Gravar no Ponto ${alvo}`}
                </button>

                <button
                    type="button"
                    onClick={limparPontos}
                    className={styles.btnReset}
                >
                    Limpar Pontos
                </button>
            </div>

            {erro && <div className={styles.erro}>{erro}</div>}

            {/* 3. Cartão de Resultado da Distância */}
            {distancia !== null && (
                <section className={styles.cartaoDistancia}>
                    <span className={styles.distanciaTitulo}>Distância Geodésica (Haversine)</span>
                    <span className={styles.distanciaValor}>{formatarDistancia(distancia)}</span>
                    <span className={styles.distanciaSub}>
                        {distancia.toFixed(2)} metros entre o Ponto A e o Ponto B
                    </span>
                </section>
            )}

            {/* 4. Cartões dos Pontos A e B */}
            <section className={styles.gridPontos}>
                <div className={styles.cartaoPonto}>
                    <div className={styles.pontoTopo}>
                        <span className={styles.pontoBadge}>Ponto A (Partida)</span>
                        <button
                            type="button"
                            onClick={() => setAlvo("A")}
                            style={{
                                fontSize: "11px",
                                background: "none",
                                border: "none",
                                color: alvo === "A" ? "#38bdf8" : "#64748b",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                        >
                            {alvo === "A" ? "Selecionado" : "Selecionar"}
                        </button>
                    </div>
                    {pontoA ? (
                        <div className={styles.pontoDados}>
                            <p>Lat: {pontoA.latitude.toFixed(6)}°</p>
                            <p>Lon: {pontoA.longitude.toFixed(6)}°</p>
                            <p style={{ color: "#94a3b8", fontSize: "11px" }}>
                                ±{pontoA.precisao.toFixed(1)} m às {pontoA.horario}
                            </p>
                        </div>
                    ) : (
                        <p style={{ color: "#64748b", fontSize: "12px", fontStyle: "italic" }}>
                            Ainda não capturado
                        </p>
                    )}
                </div>

                <div className={styles.cartaoPonto}>
                    <div className={styles.pontoTopo}>
                        <span className={styles.pontoBadge} style={{ backgroundColor: "#059669" }}>
                            Ponto B (Chegada)
                        </span>
                        <button
                            type="button"
                            onClick={() => setAlvo("B")}
                            style={{
                                fontSize: "11px",
                                background: "none",
                                border: "none",
                                color: alvo === "B" ? "#34d399" : "#64748b",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                        >
                            {alvo === "B" ? "Selecionado" : "Selecionar"}
                        </button>
                    </div>
                    {pontoB ? (
                        <div className={styles.pontoDados}>
                            <p>Lat: {pontoB.latitude.toFixed(6)}°</p>
                            <p>Lon: {pontoB.longitude.toFixed(6)}°</p>
                            <p style={{ color: "#94a3b8", fontSize: "11px" }}>
                                ±{pontoB.precisao.toFixed(1)} m às {pontoB.horario}
                            </p>
                        </div>
                    ) : (
                        <p style={{ color: "#64748b", fontSize: "12px", fontStyle: "italic" }}>
                            Ainda não capturado
                        </p>
                    )}
                </div>
            </section>

            {/* 5. Mapa OpenStreetMap com Bounding Box dos Pontos */}
            {(pontoA || pontoB) && (
                <section className={styles.mapaContainer}>
                    <div className={styles.mapaCabecalho}>
                        <span>Enquadramento Cartográfico</span>
                        <span>OpenStreetMap</span>
                    </div>
                    <iframe
                        src={montarUrlMapa()}
                        title="Mapa dos Pontos"
                        className={styles.mapaIframe}
                        loading="lazy"
                    />
                </section>
            )}

            {/* 6. Rodapé */}
            <footer className={styles.rodape}>
                Disciplina de SIG-Web • PWA funcional em JavaScript puro.
            </footer>
        </main>
    );
}
