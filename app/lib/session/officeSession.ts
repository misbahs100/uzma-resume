'use server';

import { cookies } from 'next/headers';

const OFFICE_KEY = 'uzma_selected_office';

export async function setOfficeInSession(officeId: string) {
  (await cookies()).set(OFFICE_KEY, officeId, {
    httpOnly: false,
    path: '/',
  });
}

export async function getOfficeFromSession(): Promise<string | null> {
  return (await cookies()).get(OFFICE_KEY)?.value || null;
}
