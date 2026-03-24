'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { AuthUser, LoginResponse } from '@/types/auth';
import { API_BASE_URL, apiFetch } from '@/utils/api';
import { authStorage } from '@/utils/authStorage';

type LoginParams = {
  email: string;
  password: string;
};

const getTokenPair = (data: LoginResponse) => {
  return {
    accessToken: data.accessToken ?? data.access_token ?? '',
    refreshToken: data.refreshToken ?? data.refresh_token ?? '',
  };
};

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (params: LoginParams) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthProvider = (props: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    const response = await apiFetch('/users/me');

    if (!response.ok) {
      authStorage.clear();
      setUser(null);
      throw new Error('Nao foi possivel carregar o perfil do usuario.');
    }

    const profile = (await response.json()) as AuthUser;

    authStorage.setSession({
      accessToken: authStorage.getAccessToken(),
      refreshToken: authStorage.getRefreshToken(),
      user: profile,
    });
    setUser(profile);
  };

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const cachedUser = authStorage.getUser();
      const accessToken = authStorage.getAccessToken();
      const refreshToken = authStorage.getRefreshToken();

      if (!accessToken && !refreshToken) {
        if (active) {
          setIsLoading(false);
        }

        return;
      }

      if (cachedUser) {
        setUser(cachedUser);
      }

      try {
        await refreshProfile();
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, []);

  const login = async (params: LoginParams) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      throw new Error(error?.message ?? 'Falha ao realizar login.');
    }

    const data = (await response.json()) as LoginResponse;
    const tokens = getTokenPair(data);

    if (!tokens.accessToken || !tokens.refreshToken) {
      throw new Error('Resposta de login invalida.');
    }

    authStorage.setSession({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: '',
        email: params.email,
        firstname: '',
        lastname: '',
        phone: '',
        birthday: '',
        street: '',
        city: '',
        state: '',
        zip_code: '',
        role: 'USER',
      },
    });

    await refreshProfile();
  };

  const logout = () => {
    authStorage.clear();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refreshProfile,
      user,
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de AuthProvider.');
  }

  return context;
};

export { AuthProvider, useAuth };
