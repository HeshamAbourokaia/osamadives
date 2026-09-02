import HomeClient from "./HomeClient";
import HomeStrip from "./logbook/HomeStrip";
import FeaturedReel from "@/components/FeaturedReel";

// The homepage regenerates every minute, and instantly when a logbook page is approved.
export const revalidate = 60;

export default function Home() {
  return <HomeClient stories={<HomeStrip />} reel={<FeaturedReel />} />;
}
