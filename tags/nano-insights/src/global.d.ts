/*=============*/
/* global.d.ts */
/*=============*/

/* Global type declarations to allow TypeScript and JSX to recognize <nano-insights> */
/* without requiring framework-specific type dependencies.*/

 interface HTMLNanoInsightsElement extends HTMLElement {
  projectKey?: string;
  userId?: string;
}

interface HTMLElementTagNameMap {
  "nano-insights": HTMLNanoInsightsElement;
}

declare namespace JSX {
  interface IntrinsicElements {
    "nano-insights": any;
  }
}

export {};