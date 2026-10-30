const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
let initialized = false;
export function enableAnalytics() {
  if (initialized || !measurementId || typeof document === "undefined") return;
  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true });
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(script);
}
