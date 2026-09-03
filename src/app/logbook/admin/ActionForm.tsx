"use client";

import { useState } from "react";

// The moderation form: the pressed button says Working..., the row locks, and further submits are refused until the page comes back.
// Buttons stay enabled on purpose: disabling the submitter before the request drops its name and value from the form data.
export default function ActionForm({ children, className, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  const [busy, setBusy] = useState(false);
  return (
    <form
      {...props}
      className={`${className ?? ""}${busy ? " is-busy" : ""}`}
      onSubmit={(e) => {
        if (busy) { e.preventDefault(); return; }   // one action at a time: a second press, by mouse or keyboard, is ignored until the page comes back
        const b = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        const ask = b?.dataset.confirm;
        if (ask && !window.confirm(ask)) { e.preventDefault(); return; }
        setBusy(true);
        if (b) b.textContent = "Working...";
      }}
    >
      {children}
    </form>
  );
}
