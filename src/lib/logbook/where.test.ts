import { describe, expect, it } from "vitest";
import { whereFrom } from "./where";

const req = (h: Record<string, string>) => new Request("https://www.osamadives.com/api/logbook/moderate", { headers: h });

const PHONE = "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36";
const DESKTOP = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";

describe("whereFrom", () => {
  it("names the device and the place", () => {
    expect(whereFrom(req({ "user-agent": PHONE, "x-vercel-ip-country": "EG", "x-vercel-ip-city": "Dahab" }))).toBe("a phone in Dahab, Egypt");
  });

  it("tells a computer from a phone", () => {
    expect(whereFrom(req({ "user-agent": DESKTOP, "x-vercel-ip-country": "AU", "x-vercel-ip-city": "Melbourne" }))).toBe("a computer in Melbourne, Australia");
  });

  it("trusts the browser's own word over the agent string", () => {
    expect(whereFrom(req({ "user-agent": DESKTOP, "sec-ch-ua-mobile": "?1", "x-vercel-ip-country": "EG" }))).toBe("a phone in Egypt");
  });

  it("decodes a city written with spaces", () => {
    expect(whereFrom(req({ "user-agent": PHONE, "x-vercel-ip-country": "GB", "x-vercel-ip-city": "Milton%20Keynes" }))).toBe("a phone in Milton Keynes, United Kingdom");
  });

  it("keeps an unknown country code rather than dropping it", () => {
    expect(whereFrom(req({ "user-agent": PHONE, "x-vercel-ip-country": "ZZ" }))).toContain("a phone in");
  });

  it("says the device alone when there are no headers from Vercel", () => {
    expect(whereFrom(req({ "user-agent": PHONE }))).toBe("a phone");
  });

  it("returns nothing rather than guessing when there is nothing to read", () => {
    expect(whereFrom(req({}))).toBe("");
  });
});
