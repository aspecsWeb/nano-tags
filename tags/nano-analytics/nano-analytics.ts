class NanoAnalytics extends HTMLElement {
  userId: string | null;

  constructor() {
    super();
    // Retrieve the user ID from the element's attributes
    this.userId = this.getAttribute("userId");

    if (!this.userId) {
      throw new Error("User ID is required");
    }
  }

  connectedCallback() {
    // Trigger the initial page view tracking
    this.trackPageView();
    // Listen for navigation events (back/forward button presses) to track page views
    window.addEventListener("popstate", this.trackPageView.bind(this));
  }

  disconnectedCallback() {
    // Remove the event listener when the component is removed from the DOM
    window.removeEventListener("popstate", this.trackPageView.bind(this));
  }

  trackPageView() {
    // Send a request to the analytics API with user ID, current URL, and timestamp
    fetch("/api/tags/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: this.userId,
        url: window.location.pathname,
        timestamp: new Date().toISOString(),
      }),
    });
  }
}

// Define the custom web component as "nano-analytics"
customElements.define("nano-analytics", NanoAnalytics);
