/*=============*/
/* global.d.ts */
/*=============*/

/* Global type declarations to allow TypeScript and JSX to recognize <nano-insights>
   without requiring framework-specific type dependencies. */

// Extend built-in PerformanceEventTiming to match the DOM definitions exactly.
declare global {
  interface PerformanceEventTiming extends PerformanceEntry {
    readonly processingStart: DOMHighResTimeStamp;
    readonly processingEnd: DOMHighResTimeStamp;
  }

  // Declare PerformanceLayoutShift matching required properties.
  interface PerformanceLayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
  }
}

interface HTMLNanoInsightsElement extends HTMLElement {
  projectKey?: string;
  userId?: string;
}

interface HTMLElementTagNameMap {
  "nano-insights": HTMLNanoInsightsElement;
}

declare namespace JSX {
  interface IntrinsicElements {
    "nano-insights": Partial<HTMLNanoInsightsElement>;
  }
}

export {};
