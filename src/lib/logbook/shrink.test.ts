import { describe, expect, it } from "vitest";
import { PHOTO_EDGE, fitWithin, jpegName } from "./shrink";

describe("fitWithin", () => {
  it("leaves a photo that already fits alone", () => {
    expect(fitWithin(1200, 900)).toEqual({ width: 1200, height: 900 });
    expect(fitWithin(PHOTO_EDGE, 1000)).toEqual({ width: PHOTO_EDGE, height: 1000 });
  });

  it("brings the long edge down to the limit and keeps the shape", () => {
    // A 48 MP iPhone photo, landscape and portrait.
    expect(fitWithin(8064, 6048)).toEqual({ width: 2048, height: 1536 });
    expect(fitWithin(6048, 8064)).toEqual({ width: 1536, height: 2048 });
  });

  it("never rounds a thin panorama down to nothing", () => {
    expect(fitWithin(20000, 4).height).toBe(1);
  });
});

describe("jpegName", () => {
  it("swaps the extension for .jpg", () => {
    expect(jpegName("IMG_4821.HEIC")).toBe("IMG_4821.jpg");
    expect(jpegName("reef.png")).toBe("reef.jpg");
    expect(jpegName("no-extension")).toBe("no-extension.jpg");
    expect(jpegName("")).toBe("photo.jpg");
  });
});
