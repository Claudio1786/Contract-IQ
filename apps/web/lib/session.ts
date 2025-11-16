/**
 * Session Helper Functions
 * Epic 1: Task 1.2 - Session Management
 */

import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { redirect } from 'next/navigation';

/**
 * Get the current session (server-side)
 * Returns null if no session exists
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Require authentication - throws error if not authenticated
 * Use in server components and API routes
 */
export async function requireAuth() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/login');
  }
  
  return session;
}

/**
 * Get the current user or redirect to login
 * Convenience function for server components
 */
export async function getCurrentUser() {
  const session = await requireAuth();
  return session.user;
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: string | string[]) {
  const session = await getSession();
  
  if (!session?.user?.role) {
    return false;
  }
  
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(session.user.role);
}

/**
 * Require specific role - redirect if not authorized
 */
export async function requireRole(role: string | string[]) {
  const session = await requireAuth();
  
  const roles = Array.isArray(role) ? role : [role];
  
  if (!roles.includes(session.user.role)) {
    redirect('/dashboard'); // Redirect to dashboard if unauthorized
  }
  
  return session;
}

/**
 * Check if user is admin
 */
export async function isAdmin() {
  return await hasRole('ADMIN');
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return await requireRole('ADMIN');
}

/**
 * Type augmentation for session user
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}
