import { existsSync } from "node:fs";
import { join } from "node:path";
import VoicePlayer from "./VoicePlayer";

/** Osama's voice note appears the moment public/voice/osama-hello.m4a is on the site, and not before. */
export default function VoiceNote() {
  if (!existsSync(join(process.cwd(), "public", "voice", "osama-hello.m4a"))) return null;
  return <VoicePlayer />;
}
