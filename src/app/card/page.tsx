import type { Metadata } from "next";
import CardScreen from "./CardScreen";

export const metadata: Metadata = {
  title: "Osama's review card",
  description: "Show this to a diver. They scan it, or hold a finger on it, and write Osama a review.",
  robots: { index: false, follow: false },
  manifest: "/card.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Reviews" },
  themeColor: "#06141B",
};

// Osama's own screen. Saved to his home screen it opens full screen, and it works
// with no signal: the code is drawn in the page, not fetched.
export default function CardPage() {
  return <CardScreen />;
}
