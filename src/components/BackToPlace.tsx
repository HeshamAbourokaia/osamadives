"use client";

import { useEffect, useState } from "react";

// On an inner page: a small pill that takes the visitor back to where they were on the
// homepage, when the homepage remembered a place. Nothing shows otherwise.
export default function BackToPlace() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try { setShow(Number(sessionStorage.getItem("od_home_y") || 0) > 400); } catch { setShow(false); }
  }, []);
  if (!show) return null;
  return (
    <a href="/#back" className="backplace" aria-label="Back to where you were on the homepage">
      <span aria-hidden="true">&larr;</span> Back to where you were
    </a>
  );
}
