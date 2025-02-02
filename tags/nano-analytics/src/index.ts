// export * from './functions';
// export * from './types';

class NanoAnalytics extends HTMLElement {
  private projectId: string | null;
  private userId: string | null;
  private sessionId: string;

  constructor() {
    super();
    this.projectId = this.getAttribute("projectId");
    this.userId = this.getAttribute("userId");
    this.sessionId = localStorage.getItem('nanoAnalyticsSessionId') || crypto.randomUUID();
    localStorage.setItem('nanoAnalyticsSessionId', this.sessionId);
  }

  connectedCallback() {
    this.trackPageView();
    window.addEventListener("popstate", this.trackPageView.bind(this));
    window.addEventListener("nanoAnalyticsEvent", this.trackEvent.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this.trackPageView.bind(this));
    window.removeEventListener("nanoAnalyticsEvent", this.trackEvent.bind(this));
  }

  private trackPageView() {
    this.sendToApi({
      eventType: 'page_view',
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }

  private trackEvent(e: CustomEvent) {
    this.sendToApi({
      eventType: e.detail.name,
      event_data: e.detail.data,
    });
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

export default NanoAnalytics;