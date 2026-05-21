import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`,
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

  const isAuth = url.startsWith('/auth/');
  const isMeOrProfile = url.includes('/me') || url.includes('/profile');

  if (isAuth && !isMeOrProfile) return true;

  if (
    method === 'get' &&
    (url.startsWith('/home-banner') ||
      url.startsWith('/promo-banner') ||
      url.startsWith('/favourite-section') ||
      url.startsWith('/sections') ||
      url.startsWith('/products') ||
      url.startsWith('/categories') ||
      url.startsWith('/brands') ||
      url.startsWith('/catalog'))
  ) {
    return true;
  }

  if (method === 'post' && url.startsWith('/orders/calculate-pricing')) {
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
  async (error) => {
    const config = error.config;
    
    // 1. Exponential retry logic for network errors and transient 5xx errors
    if (config && (!error.response || (error.response.status >= 500 && error.response.status <= 504))) {
      config.__retryCount = config.__retryCount || 0;
      
      const MAX_RETRIES = 3;
      if (config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1;
        const delay = config.__retryCount * 1500;
        
        console.warn(`[Network Retry] Transient error on ${config.url}. Retry attempt #${config.__retryCount} in ${delay}ms...`);
        
        // Wait for exponential delay and retry request
        await new Promise((resolve) => setTimeout(resolve, delay));
        return api(config);
      }
    }

    // 2. Authentication 401 redirect logic
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname || '';
      const loginPath = resolveLoginPath(path);

      // Important: Only clear token and redirect if it was a PRIVATE request
      // If it was a public request (like categories) that failed with 401,
      // we might just have a stale token. We should clear it but stay on the page.
      const wasPublic = isPublicRequest(config || {});

      localStorage.removeItem(AUTH_STORAGE_KEY);

      if (!wasPublic && path !== loginPath) {
        window.location.assign(loginPath);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
