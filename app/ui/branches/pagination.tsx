import { fetchOfficesPages } from "@/app/lib/data";
import Pagination from "../pagination";

export default async function OfficePagination({
    query,
}: {
  query: string;
}) {
  const totalPages = await fetchOfficesPages(query);

  return (
    <div className="mt-5 flex w-full justify-center">
      <Pagination totalPages={totalPages} />
    </div>
  );
}