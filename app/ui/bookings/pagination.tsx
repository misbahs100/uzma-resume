import { fetchBookingsPages } from "@/app/lib/data";
import Pagination from "../pagination";

export default async function BookingPagination({
    query,
}: {
  query: string;
}) {
  const totalPages = await fetchBookingsPages(query);

  return (
    <div className="mt-5 flex w-full justify-center">
      <Pagination totalPages={totalPages} />
    </div>
  );
}