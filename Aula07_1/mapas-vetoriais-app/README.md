# 🗺️ SIG-Web: Mapas Vetoriais e Tabela de Atributos (Aula 07.1)

> **Prof. José Rui** · Disciplina de Sistemas de Informação Geográfica para Web (SIG-Web)

Aplicação Web moderna em **Next.js** e **Leaflet** demonstrando a renderização soberana de arquivos vetoriais **GeoJSON** sobre camadas de imagens de satélite e ruas, com consulta interativa à **Tabela de Atributos** (`properties`) através de Popups (o equivalente Web do *Callout* do ArcGIS).

---

## 🎯 Conceitos Chave

1. **GeoJSON (`public/hidrografia.geojson`):**
   - O padrão aberto (RFC 7946) que substitui com perfeição o velho Shapefile (`.shp`).
   - Carrega geometrias e propriedades (tabela de atributos) em um arquivo JSON único.
2. **Componente `<GeoJSON />` do `react-leaflet`:**
   - Interpreta feições pontuais, lineares e poligonais diretamente na tela.
3. **Propriedade `onEachFeature`:**
   - Permite interceptar cada elemento geométrico e vincular eventos (`click`, `mouseover`) e balões informativos com `layer.bindPopup(html)`.
4. **Hit Tolerance (Tolerância ao Toque):**
   - O Leaflet expande automaticamente a área clicável da linha vetorial, facilitando a interação mesmo em telas de smartphones.

---

## 🚀 Como Executar

No terminal, dentro da pasta deste projeto:

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🛠️ Tecnologias Utilizadas

- **Next.js 16 (App Router)** — Framework React com renderização moderna
- **JavaScript Puro (.jsx)** — Código limpo, sem complexidade de tipagens
- **Leaflet & React-Leaflet** — Biblioteca cartográfica leve e de código aberto
- **CSS Modules** — Estilização modular e simples sem dependência de Tailwind
