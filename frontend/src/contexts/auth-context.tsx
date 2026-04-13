"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiRequest, getApiErrorMessage } from "@/lib/api";
import type { AuthUser } from "@/types/auth";
import type { LoginValues, RegisterValues } from "@/lib/auth-schemas";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  bootstrapping: boolean;
  login: (values: LoginValues) => Promise<void>;
  register: (values: RegisterValues) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthState | null>(null);

async function fetchMe(accessToken: string): Promise<AuthUser> {
  const data = await apiRequest<{ user: AuthUser }>("/api/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data.user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  const refreshAccessToken = useCallback(async () => {
    try {
      const data = await apiRequest<{ accessToken: string }>("/api/auth/refresh", {
        method: "POST",
      });
      setAccessToken(data.accessToken);
      const me = await fetchMe(data.accessToken);
      setUser(me);
      return true;
    } catch {
      setAccessToken(null);
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      await refreshAccessToken();
      if (alive) {
        setBootstrapping(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [refreshAccessToken]);

  const login = useCallback(async (values: LoginValues) => {
    const data = await apiRequest<{ user: AuthUser; accessToken: string }>("/api/auth/login", {
      method: "POST",
      json: { email: values.email, password: values.password },
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  const register = useCallback(async (values: RegisterValues) => {
    const data = await apiRequest<{ user: AuthUser; accessToken: string }>("/api/auth/register", {
      method: "POST",
      json: { email: values.email, password: values.password },
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
    } catch {
      /* limpa sessão local mesmo se a API falhar */
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      bootstrapping,
      login,
      register,
      logout,
      refreshAccessToken,
    }),
    [user, accessToken, bootstrapping, login, register, logout, refreshAccessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}

export { getApiErrorMessage };
