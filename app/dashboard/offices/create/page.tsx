import { Metadata } from 'next';
import CreateBranchForm from '@/app/ui/branches/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Create Office'
}
 
export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Offices', href: '/dashboard/offices' },
          {
            label: 'Create Office',
            href: '/dashboard/offices/create',
            active: true,
          },
        ]}
      />
      <CreateBranchForm />
    </main>
  );
}