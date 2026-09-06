import { Archivo, IBM_Plex_Mono } from "next/font/google";

// The house type, loaded once and shared by the homepage and every inner page.
export const archivo = Archivo({ subsets: ["latin"], weight: ["500", "600", "700", "800", "900"], variable: "--lb-display", display: "swap" });
export const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--lb-mono", display: "swap" });
