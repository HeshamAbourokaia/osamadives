import type { ReactNode } from "react";
import { archivo, plex } from "./fonts";
import { WHATSAPP } from "@/lib/contact";
import DescentNav from "./DescentNav";
import Contours from "./Contours";
import TailFoot from "./TailFoot";
import TapRipple from "./TapRipple";
import BackToTop from "@/components/BackToTop";
import SideRail from "./SideRail";
import MobileDock from "./MobileDock";
import "./descent.css";
import "./inner.css";

/**
 * The frame every inner page sits in, so the journal, the gallery, the sites and
 * the rest read as rooms of the same house as the homepage: the same type, the top
 * bar and its phone sheet, the grain, the chart on the paper, the foot with the
 * show-a-friend code. The page's own content sits on bone paper in between.
 */
export default function DescentShell({ children }: { children: ReactNode }) {
  return (
    <div className={`descent descent-inner ${archivo.variable} ${plex.variable}`}>
      <div className="sc-grain" aria-hidden="true" />
      <DescentNav whatsapp={WHATSAPP} />
      <div className="inner g-bone" data-sc-spotlight>
        <Contours seed={5} glow={false} />
        <div className="inner-body">{children}</div>
      </div>
      <div className="tail"><TailFoot /></div>
      <SideRail mode="site" />
      <MobileDock />
      <BackToTop />
      <TapRipple />
    </div>
  );
}
