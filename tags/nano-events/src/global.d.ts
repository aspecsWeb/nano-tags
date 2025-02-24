/*=============*/
/* global.d.ts */
/*=============*/

/* Global type declarations to allow TypeScript and JSX to recognize <nano-custom> */
/* without requiring framework-specific type dependencies.*/

 interface HTMLNanoCustomElement extends HTMLElement {
  projectKey?: string;
  userId?: string;
}

interface HTMLElementTagNameMap {
  "nano-custom": HTMLNanoCustomElement;
}

declare namespace JSX {
  interface IntrinsicElements {
    "nano-custom": any;
  }
}

export {};