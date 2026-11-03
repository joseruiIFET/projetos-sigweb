"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

// O Leaflet precisa do objeto window, que só existe no navegador
const MapaVetorial = dynamic(() => import("../components/MapaVetorial"), {
    ssr: false,
    loading: () => <p className={styles.instrucaoVazio}>Carregando o mapa...</p>,
});

export default function Home() {
    const [municipio, setMunicipio] = useState(null);

    return (
        <main className={styles.container}>
            <header className={styles.cabecalho}>
                <h1>Mapas Vetoriais e Tabela de Atributos</h1>
                <p>Municípios de Minas Gerais (IBGE) em GeoJSON</p>
            </header>

            <section className={styles.mapaWrapper}>
                <MapaVetorial onSelecionarMunicipio={setMunicipio} />
            </section>

            <section className={styles.cardPainel}>
                <h2 className={styles.cardTitulo}>Tabela de Atributos (properties)</h2>

                {municipio ? (
                    <div className={styles.gridAtributos}>
                        <div className={styles.itemAtributo}>
                            <div className={styles.itemRotulo}>Município</div>
                            <div className={styles.itemValor}>{municipio.NM_MUN}</div>
                        </div>
                        <div className={styles.itemAtributo}>
                            <div className={styles.itemRotulo}>Região imediata</div>
                            <div className={styles.itemValor}>{municipio.NM_RGI}</div>
                        </div>
                        <div className={styles.itemAtributo}>
                            <div className={styles.itemRotulo}>Região intermediária</div>
                            <div className={styles.itemValor}>{municipio.NM_RGINT}</div>
                        </div>
                        <div className={styles.itemAtributo}>
                            <div className={styles.itemRotulo}>Área</div>
                            <div className={styles.itemValor}>{municipio.AREA_KM2.toLocaleString("pt-BR")} km²</div>
                        </div>
                        <div className={styles.itemAtributo}>
                            <div className={styles.itemRotulo}>Código IBGE</div>
                            <div className={styles.itemValor}>{municipio.CD_MUN}</div>
                        </div>
                    </div>
                ) : (
                    <p className={styles.instrucaoVazio}>
                        Toque ou clique em um município para consultar os atributos do GeoJSON.
                    </p>
                )}
            </section>

            <footer className={styles.rodape}>
                SIG-Web, Prof. José Rui. Dados: IBGE, Malha Municipal 2024.
            </footer>
        </main>
    );
}
