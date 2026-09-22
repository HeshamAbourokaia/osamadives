import type { Metadata } from "next";
import DescentShell from "../DescentShell";
import ArrivalChecklist from "./ArrivalChecklist";
import "./arrival.css";

export const metadata: Metadata = {
  title: "Before you arrive | Your Dahab checklist",
  description: "A simple English and Arabic checklist for your day with Osama in Dahab. Meeting details, what to bring and questions to ask.",
  alternates: { canonical: "https://www.osamadives.com/before-you-arrive" },
};
export default function ArrivalPage() {
  return <DescentShell><main className="arrival"><ArrivalChecklist /><p><a href="/diving-with-osama">Explore the courses and a day with Osama →</a></p><p>Save this page, or use the QR code below to open it on another phone.</p></main></DescentShell>;
}
