class NanoAnalytics extends HTMLElement {

  private measurementId: string;
  private userId: string | null;
  private sessionId;
  private projectId;


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
    // Listen for custom events
    window.addEventListener("nanoAnalyticsEvent", this.trackEvent.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this.trackPageView.bind(this));
    window.removeEventListener("nanoAnalyticsEvent", this.trackEvent.bind(this));
  }

  trackPageView() {
    fetch("/api/tags/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: this.projectId,
        sessionId: this.sessionId,
        userId: this.userId,
        url: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    });
  }

  trackEvent(e) {
    fetch("/api/tags/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: this.projectId,
        sessionId: this.sessionId,
        userId: this.userId,
        url: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        eventName: e.detail.name,
        eventData: e.detail.data,
      }),
    });
  }
}

customElements.define("nano-analytics", NanoAnalytics);