/*=============*/
/* global.d.ts */
/*=============*/

/* Global type declarations to allow TypeScript and JSX to recognize <nano-stripe> */
/* without requiring framework-specific type dependencies.*/

 interface HTMLNanoStripeElement extends HTMLElement {
  projectKey?: string;
  userId?: string;
}

interface HTMLElementTagNameMap {
  "nano-stripe": HTMLNanoStripeElement;
}

declare namespace JSX {
  interface IntrinsicElements {
    "nano-stripe": any;
  }
}

export {};