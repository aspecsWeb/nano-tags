/*=============*/
/* global.d.ts */
/*=============*/

/* Global type declarations to allow TypeScript and JSX to recognize <nano-seo> */
/* without requiring framework-specific type dependencies.*/

 interface HTMLNanoSEOElement extends HTMLElement {
  projectKey?: string;
  userId?: string;
}

interface HTMLElementTagNameMap {
  "nano-seo": HTMLNanoSEOElement;
}

declare namespace JSX {
  interface IntrinsicElements {
    "nano-seo": any;
  }
}

export {};