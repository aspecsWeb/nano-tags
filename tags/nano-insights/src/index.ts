/*============*/
/*  index.ts  */
/*============*/

import { LitElement, html } from "lit";
import { property, customElement } from "lit/decorators.js";
import "./global.d";

@customElement("nano-insights")
export class NanoInsights extends LitElement {
  @property({ type: String }) projectKey: string | null = "";
  @property({ type: String }) siteUrl: string | null = "";

  connectedCallback() {
    super.connectedCallback();
    this.fetchSpeedInsights();
  }

  private async fetchSpeedInsights() {
    if (!this.projectKey || !this.siteUrl) {
      console.error("NanoInsights: Missing projectKey or siteUrl");
      return;
    }
    
    try {
      const response = await fetch("https://www.nanosights.dev/api/tags/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectKey: this.projectKey, siteUrl: this.siteUrl })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("NanoInsights Data:", data);
    } catch (error) {
      console.error("Error fetching speed insights:", error);
    }
  }
}