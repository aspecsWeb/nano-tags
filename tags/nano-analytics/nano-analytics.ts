class NanoAnalytics extends HTMLElement {
  private measurementId: string;
  private userId: string | null;
  private sessionId: string;
  private projectId: string | null;

  constructor() {
    super();
    this.measurementId = this.getAttribute("measurement-id") || "";
    this.projectId = this.getAttribute("projectId");
    this.userId = this.getAttribute("userId");
    this.sessionId = localStorage.getItem('nanoAnalyticsSessionId') || crypto.randomUUID();
    localStorage.setItem('nanoAnalyticsSessionId', this.sessionId);
  }

  connectedCallback() {
    this.loadGoogleAnalytics();
    this.trackPageView();
    window.addEventListener("popstate", this.trackPageView.bind(this));
    window.addEventListener("nanoAnalyticsEvent", this.trackEvent.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this.trackPageView.bind(this));
    window.removeEventListener("nanoAnalyticsEvent", this.trackEvent.bind(this));
  }

  private loadGoogleAnalytics() {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag("js", new Date());
      gtag("config", this.measurementId);
    };
  }

  private trackPageView() {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
      });

      // Send to your API
      this.sendToApi({
        eventType: 'page_view',
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    }
  }

  private trackEvent(e: CustomEvent) {
    if (typeof window.gtag !== "undefined") {
      // Capture custom event and send to Google Analytics
      window.gtag("event", e.detail.name, e.detail.data);

      // Send to your API
      this.sendToApi({
        eventType: e.detail.name,
        event_data: e.detail.data,
      });
    }
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
}

customElements.define("nano-analytics", NanoAnalytics);

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default NanoAnalytics;
