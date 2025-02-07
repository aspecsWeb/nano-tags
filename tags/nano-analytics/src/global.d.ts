/*=============*/
/* global.d.ts */
/*=============*/

/* Global type declarations to allow TypeScript and JSX to recognize <nano-analytics> */
/* without requiring framework-specific type dependencies.*/

 interface HTMLNanoAnalyticsElement extends HTMLElement {
  projectKey?: string;
  userId?: string;
}

interface HTMLElementTagNameMap {
  "nano-analytics": HTMLNanoAnalyticsElement;
}

declare namespace JSX {
  interface IntrinsicElements {
    "nano-analytics": any;
  }
}

export {};