"use client";

import { useState } from "react";

// The moderation form: the pressed button says Working... and the row locks until the page comes back.
export default function ActionForm({ children, className, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  const [busy, setBusy] = useState(false);
  return (
    <form
      {...props}
      className={`${className ?? ""}${busy ? " is-busy" : ""}`}
      onSubmit={(e) => {
        setBusy(true);
        const b = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        if (b) b.textContent = "Working...";
      }}
    >
      {children}
    </form>
  );
}
