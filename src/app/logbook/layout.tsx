import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./logbook.css";

const archivo = Archivo({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--lb-display", display: "swap" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--lb-mono", display: "swap" });

export default function LogbookLayout({ children }: { children: React.ReactNode }) {
  return <div className={`lb ${archivo.variable} ${plex.variable}`}>{children}</div>;
}
