/*=============*/
/* global.d.ts */
/*=============*/

/* Global type declarations to allow TypeScript and JSX to recognize <nano-accessibility> */
/* without requiring framework-specific type dependencies.*/

 interface HTMLNanoAccessibilityElement extends HTMLElement {
  projectKey?: string;
  userId?: string;
}

interface HTMLElementTagNameMap {
  "nano-accessibility": HTMLNanoAccessibilityElement;
}

declare namespace JSX {
  interface IntrinsicElements {
    "nano-accessibility": any;
  }
}

export {};