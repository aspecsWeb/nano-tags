/*============*/
/*  index.ts  */
/*============*/

import "./global.d.ts";

let BaseHTMLElement: { new (): HTMLElement; prototype: HTMLElement };

if (typeof window === "undefined" || typeof HTMLElement === "undefined") {
  // SSR environment: provide a dummy class to satisfy references to HTMLElement.
  class DummyHTMLElement {}
  BaseHTMLElement = DummyHTMLElement as unknown as { new (): HTMLElement; prototype: HTMLElement };
} else {
  BaseHTMLElement = HTMLElement;
}

export class NanoAnalytics extends BaseHTMLElement {
  private projectKey: string | null;
  private userId: string | null;
  private sessionId: string;
  private boundTrackPageView: () => void;
  private boundTrackEvent: (e: Event) => void;

  constructor() {
    super();
    this.projectKey = this.getAttribute("projectKey");
    this.userId = this.getAttribute("userId");

    // Use localStorage and crypto.randomUUID if available
    this.sessionId =
      (typeof localStorage !== "undefined" && localStorage.getItem("nanoAnalyticsSessionId")) ||
      (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
      Math.random().toString(36).slice(2);

    if (typeof localStorage !== "undefined") {
      localStorage.setItem("nanoAnalyticsSessionId", this.sessionId);
    }

    // Bind handlers for adding/removing event listeners
    this.boundTrackPageView = this.trackPageView.bind(this);
    this.boundTrackEvent = this.trackEvent.bind(this);
  }

  connectedCallback() {
    if (typeof window !== "undefined") {
      // Track once immediately and listen to changes on the client
      this.trackPageView();
      window.addEventListener("popstate", this.boundTrackPageView);
      window.addEventListener("nanoAnalyticsEvent", this.boundTrackEvent as EventListener);
    }
  }

  disconnectedCallback() {
    if (typeof window !== "undefined") {
      window.removeEventListener("popstate", this.boundTrackPageView);
      window.removeEventListener("nanoAnalyticsEvent", this.boundTrackEvent as EventListener);
    }
  }

  private trackPageView() {
    const pageViewData = {
      eventType: "page_view",
      page_title: typeof document !== "undefined" ? document.title : "",
      page_location: typeof window !== "undefined" ? window.location.href : "",
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
    };
    this.sendToApi(pageViewData);
  }

  private trackEvent(e: Event) {
    const customEvent = e as CustomEvent<{ name: string; data: unknown }>;
    const eventData = {
      eventType: customEvent.detail.name,
      event_data: customEvent.detail.data,
    };
    this.sendToApi(eventData);
  }

  private sendToApi(data: Record<string, unknown>) {
    if (typeof fetch !== "undefined") {
      fetch("http://localhost:3000/api/tags/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectKey: this.projectKey,
          sessionId: this.sessionId,
          userId: this.userId,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
          ...data,
        }),
      });
    }
  }
}

// Register the custom element if in a browser environment.
if (typeof window !== "undefined" && window.customElements) {
  customElements.define("nano-analytics", NanoAnalytics);
}