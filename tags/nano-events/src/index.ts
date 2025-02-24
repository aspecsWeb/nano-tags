/*============*/
/*  index.ts  */
/*============*/

import "./global.js";

let BaseHTMLElement: { new (): HTMLElement; prototype: HTMLElement };

if (typeof window === "undefined" || typeof HTMLElement === "undefined") {
  // SSR environment: provide a dummy class to satisfy references to HTMLElement.
  class DummyHTMLElement {}
  BaseHTMLElement = DummyHTMLElement as unknown as { new (): HTMLElement; prototype: HTMLElement };
} else {
  BaseHTMLElement = HTMLElement;
}

export class NanoCustom extends BaseHTMLElement {
  private projectKey: string | null;
  private userId: string | null;
  private sessionId: string;

  constructor() {
    super();
    this.projectKey = this.getAttribute("projectKey");
    this.userId = this.getAttribute("userId");

    // Use localStorage and crypto.randomUUID if available
    this.sessionId =
      (typeof localStorage !== "undefined" && localStorage.getItem("nanoCustomSessionId")) ||
      (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
      Math.random().toString(36).slice(2);

    if (typeof localStorage !== "undefined") {
      localStorage.setItem("nanoCustomSessionId", this.sessionId);
    }
  }
}

// Register the custom element if in a browser environment.
if (typeof window !== "undefined" && window.customElements) {
  customElements.define("nano-custom", NanoCustom);
}