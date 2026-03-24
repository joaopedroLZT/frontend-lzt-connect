import type { AuthUser } from '@/types/auth';

const ACCESS_TOKEN_KEY = 'lzt-connect.access-token';
const REFRESH_TOKEN_KEY = 'lzt-connect.refresh-token';
const USER_KEY = 'lzt-connect.user';

const isBrowser = () => typeof window !== 'undefined';

const authStorage = {
  clear() {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  },
  getAccessToken() {
    if (!isBrowser()) {
      return '';
    }

    return window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? '';
  },
  getRefreshToken() {
    if (!isBrowser()) {
      return '';
    }

    return window.localStorage.getItem(REFRESH_TOKEN_KEY) ?? '';
  },
  getUser() {
    if (!isBrowser()) {
      return null;
    }

    const rawUser = window.localStorage.getItem(USER_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      return null;
    }
  },
  setSession(params: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.setItem(ACCESS_TOKEN_KEY, params.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, params.refreshToken);
    window.localStorage.setItem(USER_KEY, JSON.stringify(params.user));
  },
  setAccessToken(accessToken: string) {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },
  setRefreshToken(refreshToken: string) {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
};

export { authStorage };
