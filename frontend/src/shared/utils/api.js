import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const AUTH_STORAGE_KEY = 'riddha_user';

const safeJsonParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getStoredAuth = () => {
  const parsed = safeJsonParse(localStorage.getItem(AUTH_STORAGE_KEY));
  if (!parsed || typeof parsed !== 'object') return null;

  if (typeof parsed.token === 'string') return parsed;

  if (parsed.user && typeof parsed.user.token === 'string') {
    return {
      ...parsed.user,
      role: parsed.role || parsed.user.role,
      token: parsed.user.token
    };
  }

  return parsed;
};

const isPublicRequest = (config) => {
  const method = (config.method || 'get').toLowerCase();
  const url = String(config.url || '');

  if (url.startsWith('/auth/')) return true;

  if (
    method === 'get' &&
    (url.startsWith('/home-banner') ||
      url.startsWith('/promo-banner') ||
      url.startsWith('/favourite-section') ||
      url.startsWith('/sections') ||
      url.startsWith('/products') ||
      url.startsWith('/categories'))
  ) {
    return true;
  }

  return false;
};

const resolveLoginPath = (pathname = '') => {
  if (pathname.startsWith('/admin')) return '/admin/login';
  if (pathname.startsWith('/seller')) return '/seller/login';
  if (pathname.startsWith('/delivery')) return '/delivery/login';
  return '/login';
};

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const user = getStoredAuth();
    if (user?.token) {
      // console.log('Attaching Token for:', user.role);
      config.headers.Authorization = `Bearer ${user.token}`;
    } else if (!isPublicRequest(config)) {
      console.warn('No token found in localStorage for request:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname || '';
      const loginPath = resolveLoginPath(path);

      localStorage.removeItem(AUTH_STORAGE_KEY);

      if (path !== loginPath) {
        window.location.assign(loginPath);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
