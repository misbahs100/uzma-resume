import { Metadata } from 'next';
import CreateUserForm from '@/app/ui/users/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { auth, getUser } from '@/auth';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Create Invoice'
}
 
export default async function Page() {
  const session = await auth();
    let userInfo = null;
    if (session?.user?.email) {
      userInfo = await getUser(session.user.email);
    }
  
    if (userInfo?.user_role !== "admin" || !session?.user?.email) {
      notFound()
      return;
    }
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Users', href: '/dashboard/users' },
          {
            label: 'Create User',
            href: '/dashboard/users/create',
            active: true,
          },
        ]}
      />
      <CreateUserForm />
    </main>
  );
}