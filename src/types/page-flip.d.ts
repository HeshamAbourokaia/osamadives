// page-flip ships no type definitions; the book only needs the class to exist.
declare module "page-flip" {
  export class PageFlip {
    constructor(el: HTMLElement, settings: Record<string, unknown>);
    loadFromHTML(items: NodeListOf<Element> | Element[]): void;
    on(event: string, cb: (e: { data: unknown }) => void): void;
    flipNext(): void;
    flipPrev(): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    getOrientation(): "portrait" | "landscape";
    update(): void;
    destroy(): void;
  }
}
