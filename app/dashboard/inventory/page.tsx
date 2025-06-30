import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
import { BranchesTableSkeleton, PaginationSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchOfficesPages } from "@/app/lib/data";
import { Metadata } from "next";
import BranchesTable from "@/app/ui/branches/table";
import { CreateOffice } from "@/app/ui/branches/buttons";
import OfficePagination from "@/app/ui/branches/pagination";
import { CreatePart } from "@/app/ui/inventory/buttons";
import InventoryTable from "@/app/ui/inventory/table";
import InventoryTableServer from "@/app/ui/inventory/table-server";

export const metadata: Metadata = {
  title: "Inventory",
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
        <h1 className={`${lusitana.className} text-2xl`}>Inventory Stock</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search parts (old or new)..." />
        <CreatePart />
      </div>
      <Suspense key={query + currentPage} fallback={<BranchesTableSkeleton />}>
        <InventoryTableServer query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Suspense fallback={<PaginationSkeleton />}>
          {/* <OfficePagination query={query} /> */}
        </Suspense>
      </div>
    </div>
  );
}
