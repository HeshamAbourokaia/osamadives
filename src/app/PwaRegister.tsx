"use client";

import { useEffect } from "react";

/** The site keeps a copy of the pages you have seen, so they open with no signal. */
export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || location.hostname === "localhost" && !/sw=1/.test(location.search)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
