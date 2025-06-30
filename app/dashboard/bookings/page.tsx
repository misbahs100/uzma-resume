import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
import { BranchesTableSkeleton, PaginationSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { Metadata } from "next";
import { CreateBooking } from "@/app/ui/bookings/buttons";
import BookingsTable from "@/app/ui/bookings/table";
import BookingPagination from "@/app/ui/bookings/pagination";
import BookingsTableServer from "@/app/ui/bookings/table-server";

export const metadata: Metadata = {
  title: "Bookings",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Bookings</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search bookings..." />
        <CreateBooking />
      </div>
      <Suspense key={query + currentPage} fallback={<BranchesTableSkeleton />}>
        <BookingsTableServer query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Suspense fallback={<PaginationSkeleton />}>
          <BookingPagination query={query} />
        </Suspense>
      </div>
    </div>
  );
}
