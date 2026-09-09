import type { ReactNode } from "react";
import { archivo, plex } from "./fonts";
import DescentNav from "./DescentNav";
import Contours from "./Contours";
import TailFoot from "./TailFoot";
import TapRipple from "./TapRipple";
import TripleTapQR from "./TripleTapQR";
import WhatsAppCount from "./WhatsAppCount";
import BackToTop from "@/components/BackToTop";
import SideRail from "./SideRail";
import MessageButton from "./MessageButton";
import "./descent.css";
import "./mobile.css";
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
      <DescentNav />
      <div className="inner g-bone" data-sc-spotlight>
        <Contours seed={5} glow={false} />
        <div className="inner-body">{children}</div>
      </div>
      <div className="tail"><TailFoot /></div>
      <SideRail mode="site" />
      <MessageButton />
      <BackToTop />
      <TapRipple />
      <TripleTapQR />
      <WhatsAppCount />
    </div>
  );
}
