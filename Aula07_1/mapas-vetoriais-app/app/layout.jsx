import "./globals.css";

export const metadata = {
  title: "SIG-Web - Mapas Vetoriais e Atributos",
  description: "Renderização de GeoJSON e consulta de Tabela de Atributos com Leaflet (Prof. José Rui)",
};

export const viewport = {
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                  navigator.serviceWorker.getRegistrations().then(regs => {
                    for (let r of regs) r.unregister();
                  });
                }
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
