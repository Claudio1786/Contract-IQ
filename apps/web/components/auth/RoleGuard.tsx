'use client';

/**
 * Role-Based Access Control Component
 * Epic 1: Task 1.4 - RBAC Implementation
 */

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Client-side role guard component
 * Hides content from unauthorized users
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
  redirectTo,
}: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      if (redirectTo) {
        router.push(redirectTo);
      }
      return;
    }

    const hasAccess = allowedRoles.includes(session.user.role);

    if (!hasAccess && redirectTo) {
      router.push(redirectTo);
    }
  }, [session, status, allowedRoles, redirectTo, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    return <>{fallback}</>;
  }

  const hasAccess = allowedRoles.includes(session.user.role);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Show content only to admins
 */
export function AdminOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['ADMIN']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

/**
 * Show content to admins and managers
 */
export function ManagerOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'MANAGER']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}
