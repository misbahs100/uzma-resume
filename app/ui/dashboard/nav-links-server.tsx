import { auth, getUser } from '@/auth';
import NavLinks from './nav-links';

export default async function NavLinksServer() {
  const session = await auth();
  let userRole = null;
  
  if (session?.user?.email) {
    const userInfo = await getUser(session.user.email);
    userRole = userInfo?.user_role || null;
  }

  return <NavLinks userRole={userRole} />;
}
