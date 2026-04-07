const listenersByEvent = new Map();

export function subscribe(eventName, callback) {
  if (!listenersByEvent.has(eventName)) {
    listenersByEvent.set(eventName, new Set());
  }

  const listeners = listenersByEvent.get(eventName);
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) {
      listenersByEvent.delete(eventName);
    }
  };
}

export function publish(eventName, payload) {
  const listeners = listenersByEvent.get(eventName);
  if (!listeners) {
    return;
  }

  listeners.forEach((listener) => {
    listener(payload);
  });
}

