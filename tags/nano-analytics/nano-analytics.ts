class NanoAnalytics extends HTMLElement {
  private measurementId: string

  constructor() {
    super()
    this.measurementId = this.getAttribute("measurement-id") || ""
  }

  connectedCallback() {
    this.loadGoogleAnalytics()
    this.trackPageView()
    window.addEventListener("popstate", this.trackPageView.bind(this))
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this.trackPageView.bind(this))
  }

  private loadGoogleAnalytics() {
    const script = document.createElement("script")
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      window.dataLayer = window.dataLayer || []
      function gtag(...args: any[]) {
        window.dataLayer.push(args)
      }
      gtag("js", new Date())
      gtag("config", this.measurementId)
    }
  }

  private trackPageView() {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
      })
    }
  }
}

customElements.define("nano-analytics", NanoAnalytics)

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export default NanoAnalytics
