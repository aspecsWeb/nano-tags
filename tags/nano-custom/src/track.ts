export function track(
  eventName: string,
  eventData?: Record<string, any>
) {
  // Prefer the global nanoCustom tracker if available
  if (window.nanoCustom && typeof window.nanoCustom.trackEvent === 'function') {
    window.nanoCustom.trackEvent(eventName, eventData);
  } else {
    // Fallback: dispatch a CustomEvent for <nano-custom> to catch
    window.dispatchEvent(
      new CustomEvent('nanoCustomEvent', {
        detail: { eventName, eventData }
      })
    );
  }
}
