import { authStorage } from '@/utils/authStorage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://192.168.1.163:3000';

type RefreshResponse = {
  accessToken?: string;
  refreshToken?: string;
  access_token?: string;
  refresh_token?: string;
};

const getTokenPair = (data: RefreshResponse) => {
  const accessToken = data.accessToken ?? data.access_token ?? '';
  const refreshToken = data.refreshToken ?? data.refresh_token;

  return {
    accessToken,
    refreshToken,
  };
};

const createHeaders = (token?: string) => {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
};

const mergeHeaders = (initHeaders?: HeadersInit, token?: string) => {
  const headers = createHeaders(token);

  if (initHeaders) {
    new Headers(initHeaders).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
};

const refreshAccessToken = async () => {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error('Sessao expirada. Faca login novamente.');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify({ token: refreshToken }),
  });

  if (!response.ok) {
    authStorage.clear();
    throw new Error('Sessao expirada. Faca login novamente.');
  }

  const data = (await response.json()) as RefreshResponse;
  const tokens = getTokenPair(data);

  if (!tokens.accessToken) {
    authStorage.clear();
    throw new Error('Sessao expirada. Faca login novamente.');
  }

  authStorage.setAccessToken(tokens.accessToken);
  authStorage.setRefreshToken(tokens.refreshToken ?? refreshToken);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken ?? refreshToken,
  };
};

const apiFetch = async (
  path: string,
  init?: RequestInit,
  retry = true,
) => {
  const accessToken = authStorage.getAccessToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: mergeHeaders(init?.headers, accessToken),
  });

  if (response.status === 401 && retry) {
    const refreshed = await refreshAccessToken();

    return fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: mergeHeaders(init?.headers, refreshed.accessToken),
    });
  }

  return response;
};

export { API_BASE_URL, apiFetch };
