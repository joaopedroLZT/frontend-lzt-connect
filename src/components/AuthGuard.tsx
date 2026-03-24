'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import type { UserRole } from '@/types/auth';

import { useAuth } from '@/components/AuthProvider';

type AuthGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
  requireRole?: UserRole;
};

const AuthGuard = (props: AuthGuardProps) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (
      !isLoading
      && isAuthenticated
      && props.requireRole
      && user?.role !== props.requireRole
    ) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, props.requireRole, router, user?.role]);

  if (isLoading || !isAuthenticated) {
    return props.fallback ?? null;
  }

  if (props.requireRole && user?.role !== props.requireRole) {
    return props.fallback ?? null;
  }

  return <>{props.children}</>;
};

export { AuthGuard };
