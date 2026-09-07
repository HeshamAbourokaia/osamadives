import type { ReactNode } from "react";

export const metadata = {
  title: "Dahab diving photos and stories | Osama's gallery",
  description: "Forty years of photographs from Dahab: students, reefs, the family, the town, and Osama's dives, from the shore of the Red Sea.",
  alternates: { canonical: "https://www.osamadives.com/gallery" },
};

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return children;
}
