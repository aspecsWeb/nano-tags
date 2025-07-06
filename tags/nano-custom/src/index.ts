/*============*/
/*  index.ts  */
/*============*/

import { LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";
import "./global.d";

/**
 * The nano-custom tag enables custom event tracking by exposing a global trackEvent method
 * and listening for custom events on the window. Events are sent to the NanoSights API
 * along with projectKey, userId, and sessionId for analytics purposes.
 */

@customElement("nano-custom")
export class NanoCustom extends LitElement {
  @property({ type: String }) projectKey: string | null = "";
  @property({ type: String }) userId: string | null = "";

  private sessionId: string;

  constructor() {
    super();
    this.sessionId =
      (typeof localStorage !== "undefined" &&
        localStorage.getItem("nanoCustomSessionId")) ||
      (typeof crypto !== "undefined" &&
        crypto.randomUUID &&
        crypto.randomUUID()) ||
      Math.random().toString(36).slice(2);

    if (typeof localStorage !== "undefined") {
      localStorage.setItem("nanoCustomSessionId", this.sessionId);
    }

    // Make trackEvent available globally
    window.nanoCustom = {
      trackEvent: this.trackEvent.bind(this),
    };
  }

  connectedCallback() {
    super.connectedCallback();
    // Listen for custom events
    window.addEventListener(
      "nanoCustomEvent",
      this.handleCustomEvent.bind(this) as EventListener
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(
      "nanoCustomEvent",
      this.handleCustomEvent.bind(this) as EventListener
    );
  }

  private handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<{
      eventName: string;
      eventData?: Record<string, any>;
      category?: string;
      label?: string;
      value?: number;
    }>;

    this.trackEvent(
      customEvent.detail.eventName,
      customEvent.detail.eventData,
      customEvent.detail.category,
      customEvent.detail.label,
      customEvent.detail.value
    );
  };

  // Method exposed to users for programmatic event tracking
  trackEvent(
    eventName: string,
    eventData?: Record<string, any>,
    category?: string,
    label?: string,
    value?: number
  ) {
    this.sendToApi({
      event_name: eventName,
      event_data: eventData || {},
      event_category: category || "custom",
      event_label: label,
      event_value: value,
    });
  }

  private sendToApi(data: Record<string, unknown>) {
    if (!this.projectKey) {
      console.error("No project key provided for nano-custom");
      return;
    }

    fetch("https://www.nanosights.dev/api/tag/custom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectKey: this.projectKey,
        sessionId: this.sessionId,
        userId: this.userId,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        url: window.location.href,
        page_title: document.title,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString(),
        ...data,
      }),
    });
  }
}

// Declare global namespace for TypeScript
declare global {
  interface Window {
    nanoCustom: {
      trackEvent: (
        eventName: string,
        eventData?: Record<string, any>,
        category?: string,
        label?: string,
        value?: number
      ) => void;
    };
  }
}
