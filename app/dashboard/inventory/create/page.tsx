import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import CreateInventoryForm from '@/app/ui/inventory/create-form';

export const metadata: Metadata = {
  title: 'Create Inventory'
}
 
export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Inventory', href: '/dashboard/inventory' },
          {
            label: 'Add Part',
            href: '/dashboard/inventory/create',
            active: true,
          },
        ]}
      />
      <CreateInventoryForm />
    </main>
  );
}