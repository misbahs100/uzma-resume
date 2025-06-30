import { Metadata } from 'next';
import CreateBranchForm from '@/app/ui/branches/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import CreateBookingForm from '@/app/ui/bookings/create-form';

export const metadata: Metadata = {
  title: 'Create Booking'
}
 
export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Bookings', href: '/dashboard/bookings' },
          {
            label: 'Create Booking',
            href: '/dashboard/bookings/create',
            active: true,
          },
        ]}
      />
      <CreateBookingForm />
    </main>
  );
}