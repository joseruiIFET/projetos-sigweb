# SIG-Web: Mapas Vetoriais e Tabela de Atributos (Aula 07.2)

**Prof. José Rui**, Disciplina de Sistemas de Informação Geográfica para Web (SIG-Web)

Aplicação Web em **Next.js** e **Leaflet** que exibe os municípios de Minas Gerais em **GeoJSON** sobre camadas de satélite e ruas, com consulta à **Tabela de Atributos** (`properties`) por meio de Popups.

---

## Conceitos Chave

1. **GeoJSON (`public/municipios-mg.geojson`):**
   - Formato aberto (RFC 7946) que guarda geometrias e atributos em um único arquivo.
   - Gerado na Aula 07.1 a partir do shapefile do IBGE.
2. **Componente `<GeoJSON />` do `react-leaflet`:**
   - Desenha pontos, linhas e polígonos no mapa.
3. **Propriedade `onEachFeature`:**
   - Permite vincular eventos (`click`, `mouseover`) e Popups (`layer.bindPopup(html)`) a cada feição.

---

## Fonte dos Dados

[IBGE, Malha Municipal 2024](https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html), arquivo `MG_Municipios_2024.zip`. O shapefile está em SIRGAS 2000 (EPSG:4674).

O arquivo do projeto foi gerado com o Mapshaper:

```bash
npx mapshaper MG_Municipios_2024.shp \
    -simplify 3% keep-shapes \
    -filter-fields CD_MUN,NM_MUN,NM_RGI,NM_RGINT,AREA_KM2 \
    -proj wgs84 \
    -o precision=0.00001 municipios-mg.geojson format=geojson
```

---

## Como Executar

No terminal, dentro da pasta deste projeto:

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## Tecnologias Utilizadas

- **Next.js 16 (App Router)**: Framework React com renderização moderna
- **JavaScript Puro (.jsx)**: Código limpo, sem complexidade de tipagens
- **Leaflet & React-Leaflet**: Biblioteca cartográfica leve e de código aberto
- **CSS Modules**: Estilização modular e simples sem dependência de Tailwind
