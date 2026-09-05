type LoadingListener = (activeCount: number) => void;

let activeRequests = 0;
const listeners = new Set<LoadingListener>();

function notify() {
  listeners.forEach((listener) => listener(activeRequests));
}

export function subscribeLoading(listener: LoadingListener) {
  listeners.add(listener);
  listener(activeRequests);
  return () => listeners.delete(listener);
}

export function getActiveRequestCount() {
  return activeRequests;
}

export function trackRequestStart() {
  activeRequests += 1;
  notify();
}

export function trackRequestEnd() {
  activeRequests = Math.max(0, activeRequests - 1);
  notify();
}

export function isLoadingActive() {
  return activeRequests > 0;
}
