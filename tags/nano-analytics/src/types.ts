// types.ts
declare global {
  // Extend HTMLElement to define a typed interface for NanoAnalytics
  interface HTMLNanoAnalyticsElement extends HTMLElement {
    projectId?: string;
    userId?: string;
    gaMeasurementId?: string;
  }

  // Map the custom element tag name to your interface
  interface HTMLElementTagNameMap {
    'nano-analytics': HTMLNanoAnalyticsElement;
  }

  // Extend the JSX namespace to recognize the attributes for the custom element
  namespace JSX {
    interface IntrinsicElements {
      'nano-analytics': {
        projectId?: string;
        userId?: string;
        gaMeasurementId?: string;
        [key: string]: any; // Allow any other unspecified attributes
      };
    }
  }
}

// Export an empty object to ensure this file is treated as a module
export {};