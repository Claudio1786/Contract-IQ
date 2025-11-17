import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Home Page - Server-side redirect to login or dashboard
 */
export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
