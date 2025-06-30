import { fetchFilteredBookings } from "@/app/lib/data";
import BookingsTable from "./table";

export default async function BookingsTableServer({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const bookings = await fetchFilteredBookings(query, currentPage);

  return <BookingsTable bookings={bookings} />;
}