/*============*/
/*  types.ts  */
/*============*/

declare global {
  // Extend HTMLElement to define a typed interface for NanoAnalytics
  interface HTMLNanoAnalyticsElement extends HTMLElement {
    projectId?: string;
    userId?: string;
  }

  // Map the custom element tag name to your interface
  interface HTMLElementTagNameMap {
    "nano-analytics": HTMLNanoAnalyticsElement;
  }

  // The JSX namespace extension is not needed unless you're using React.
  // If you are using React, you can include it; otherwise, you can remove or ignore it.
  namespace JSX {
    interface IntrinsicElements {
      "nano-analytics": {
        projectId?: string;
        userId?: string;
      };
    }
  }
}

export {};