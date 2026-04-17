import { io } from 'socket.io-client';

let socketInstance = null;

function normalizeSocketUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    // If someone passes the REST baseURL ending with /api, strip it.
    if (parsed.pathname.endsWith('/api')) {
      parsed.pathname = parsed.pathname.slice(0, -'/api'.length) || '/';
    }
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return url;
  }
}

export function connectSocket({ token } = {}) {
  const base =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000';

  const url = normalizeSocketUrl(base);

  if (socketInstance) {
    // Keep auth token fresh for reconnects
    if (token) socketInstance.auth = { token };
    if (!socketInstance.connected) socketInstance.connect();
    return socketInstance;
  }

  socketInstance = io(url, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    auth: token ? { token } : undefined
  });

  return socketInstance;
}

export function getSocket() {
  return socketInstance;
}

export function disconnectSocket() {
  if (!socketInstance) return;
  socketInstance.disconnect();
  socketInstance = null;
}

