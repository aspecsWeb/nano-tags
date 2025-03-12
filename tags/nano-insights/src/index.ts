/*============*/
/*  index.ts  */
/*============*/

import { LitElement, html } from "lit";
import { property, customElement } from "lit/decorators.js";
import "./global.d";

/**
 * NanoInsights measures performance metrics (Largest Contentful Paint, First Input Delay, Cumulative Layout Shift)
 * and sends them along with projectKey, userId, and sessionId to the insights endpoint.
 */
@customElement("nano-insights")
export class NanoInsights extends LitElement {
  @property({ type: String }) projectKey: string | null = "";
  @property({ type: String }) userId: string | null = "";

  private sessionId: string;

  constructor() {
    super();
    this.sessionId =
      (typeof localStorage !== "undefined" && localStorage.getItem("nanoInsightsSessionId")) ||
      (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
      Math.random().toString(36).slice(2);

    if (typeof localStorage !== "undefined") {
      localStorage.setItem("nanoInsightsSessionId", this.sessionId);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.observePerformance();
  }

  /**
   * Observes performance metrics: LCP, FID, and CLS.
   */
  private observePerformance(): void {
    if (!("PerformanceObserver" in window)) {
      console.warn("[NanoInsights] PerformanceObserver is not supported in this browser.");
      return;
    }

    // Observe Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      for (const entry of entries) {
        if (entry.entryType === "largest-contentful-paint") {
          this.sendToApi({ metric: "LCP", value: entry.startTime });
        }
      }
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

    // Observe First Input Delay (FID)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      for (const entry of entries) {
        if (entry.entryType === "first-input") {
          const perfEntry = entry as PerformanceEventTiming;
          const delay = perfEntry.processingStart - perfEntry.startTime;
          this.sendToApi({ metric: "FID", value: delay });
        }
      }
    });
    fidObserver.observe({ type: "first-input", buffered: true });

    // Observe Cumulative Layout Shift (CLS)
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      const entries = entryList.getEntries();
      for (const entry of entries) {
        if (entry.entryType === "layout-shift" && !(entry as PerformanceLayoutShift).hadRecentInput) {
          clsValue += (entry as PerformanceLayoutShift).value;
        }
      }
      if (clsValue > 0) {
        this.sendToApi({ metric: "CLS", value: clsValue });
      }
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });
  }

  /**
   * Sends performance metric data to the insights endpoint.
   */
  private sendToApi(data: Record<string, unknown>) {
    if (!this.projectKey) {
      console.warn("[NanoInsights] Missing projectKey - cannot send data.");
      return;
    }

    fetch("http://localhost:3000/api/tags/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        projectKey: this.projectKey,
        userId: this.userId,
        sessionId: this.sessionId,
      }),
    });
  }
}
