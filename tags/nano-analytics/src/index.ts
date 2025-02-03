/*============*/
/*  index.ts  */
/*============*/

// export * from './functions';
export * from './types';

// Interface to extend the Window object if needed
interface WindowWithGA extends Window {
  gtag?: (...args: any[]) => void;
  dataLayer?: unknown[];
}

// Ensure 'window' is typed correctly
declare const window: WindowWithGA;

class NanoAnalytics extends HTMLElement {
  private projectId: string | null;
  private userId: string | null;
  private sessionId: string;

  constructor() {
    super();
    // Retrieve attribute values from the custom element
    this.projectId = this.getAttribute("projectId");
    this.userId = this.getAttribute("userId");
    // Use the stored sessionId or generate a new one
    this.sessionId = localStorage.getItem("nanoAnalyticsSessionId") || crypto.randomUUID();
    localStorage.setItem("nanoAnalyticsSessionId", this.sessionId);
  }

  connectedCallback() {
    this.trackPageView();

    // Listen for browser navigation changes
    window.addEventListener("popstate", this.trackPageView.bind(this));

    // Listen for our custom event
    window.addEventListener("nanoAnalyticsEvent", this.trackEvent.bind(this) as EventListener);
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this.trackPageView.bind(this));
    window.removeEventListener("nanoAnalyticsEvent", this.trackEvent.bind(this) as EventListener);
  }

  private trackPageView() {
    const pageViewData = {
      eventType: "page_view",
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    };

    this.sendToApi(pageViewData);
  }

  private trackEvent(e: Event) {
    // Cast the generic Event to our CustomEvent
    const customEvent = e as CustomEvent<{ name: string; data: unknown }>;
    const eventData = {
      eventType: customEvent.detail.name,
      event_data: customEvent.detail.data,
    };

    this.sendToApi(eventData);
  }

  private sendToApi(data: Record<string, unknown>) {
    fetch("/api/tags/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: this.projectId,
        sessionId: this.sessionId,
        userId: this.userId,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        ...data,
      }),
    });
  }
}

// Register the web component with a hyphenated tag name
customElements.define("nano-analytics", NanoAnalytics);

export { NanoAnalytics };