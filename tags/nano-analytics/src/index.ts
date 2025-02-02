// export * from './functions';
export * from './types';

interface WindowWithGA extends Window {
  gtag: (...args: any[]) => void;
  dataLayer: unknown[];
}

declare const window: WindowWithGA;

class NanoAnalytics extends HTMLElement {
  private projectId: string | null;
  private userId: string | null;
  private sessionId: string;
  private gaMeasurementId: string | null;

  constructor() {
    super();
    this.projectId = this.getAttribute("projectId");
    this.userId = this.getAttribute("userId");
    this.gaMeasurementId = this.getAttribute("gaMeasurementId");
    this.sessionId = localStorage.getItem("nanoAnalyticsSessionId") || crypto.randomUUID();
    localStorage.setItem("nanoAnalyticsSessionId", this.sessionId);
  }

  connectedCallback() {
    if (this.gaMeasurementId) {
      this.initializeGoogleAnalytics();
    }
    this.trackPageView();

    // Listen for browser navigation changes
    window.addEventListener("popstate", this.trackPageView.bind(this));

    // Listen for our custom event (TS now recognizes 'nanoAnalyticsEvent')
    window.addEventListener("nanoAnalyticsEvent", this.trackEvent.bind(this) as EventListener);
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this.trackPageView.bind(this));
    window.removeEventListener("nanoAnalyticsEvent", this.trackEvent.bind(this) as EventListener);
  }

  private initializeGoogleAnalytics() {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaMeasurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", this.gaMeasurementId!, { send_page_view: false });
  }

  private trackPageView() {
    const pageViewData = {
      eventType: "page_view",
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    };

    this.sendToApi(pageViewData);
    this.sendToGoogleAnalytics(pageViewData);
  }

  private trackEvent(e: Event) {
    // Cast the generic Event to our CustomEvent
    const customEvent = e as CustomEvent<{ name: string; data: unknown }>;
    const eventData = {
      eventType: customEvent.detail.name,
      event_data: customEvent.detail.data,
    };

    this.sendToApi(eventData);
    this.sendToGoogleAnalytics(eventData);
  }

  private sendToApi(data: any) {
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

  private sendToGoogleAnalytics(data: any) {
    if (this.gaMeasurementId && window.gtag) {
      if (data.eventType === "page_view") {
        window.gtag("event", "page_view", {
          page_title: data.page_title,
          page_location: data.page_location,
          page_path: data.page_path,
          send_to: this.gaMeasurementId,
        });
      } else {
        window.gtag("event", data.eventType, {
          ...data.event_data,
          send_to: this.gaMeasurementId,
        });
      }
    }
  }
}

customElements.define("nano-analytics", NanoAnalytics);

export { NanoAnalytics };