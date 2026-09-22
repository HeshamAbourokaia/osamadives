import { describe, expect, it } from "vitest";
import { DAN_SCREENING, safeGuideHref } from "./links";
import { guideProfile } from "./profile";

const contact = guideProfile.contact.href;

describe("safeGuideHref", () => {
  it("allows the site's own pages, the WhatsApp contact and the one medical page", () => {
    for (const href of ["/", "/#school-act", "/diving-with-osama", "/before-you-arrive", "/dive-sites", "/dive-sites/blue-hole-dahab", "/logbook", contact, DAN_SCREENING]) {
      expect(safeGuideHref(href, contact)).toBe(href);
    }
  });
  it("rejects everything else, however it is dressed up", () => {
    for (const href of [
      "javascript:alert(1)", "data:text/html,<script>alert(1)</script>", "//evil.example", "https://evil.example/",
      "https://www.osamadives.com.evil.example/", "https://www.osamadives.com/", "https://evil.example/?site=www.osamadives.com",
      "https://wa.me/9999999?text=hi", "https://wa.me/201090208050", "https://wa.me/201090208050?text=hi", "https://wa.me:8443/201090208050?text=hi",
      "/api/logbook/admin", "/logbook/admin", "/logbook/admin?key=x", "/dive-sites/nowhere", "\\evil.example", " /dive-sites", "/dive-sites\n",
      DAN_SCREENING + "?x=1", 42, null, undefined,
    ]) {
      expect(safeGuideHref(href, contact), String(href)).toBeNull();
    }
  });
  it("every link the answers carry passes the same policy", () => {
    expect(safeGuideHref(contact, contact)).toBe(contact);
    for (const topic of guideProfile.topics) for (const link of topic.sources ?? []) expect(safeGuideHref(link.href, contact), `${topic.id}: ${link.href}`).toBe(link.href);
  });
});
