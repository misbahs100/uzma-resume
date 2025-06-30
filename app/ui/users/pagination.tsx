import { fetchUsersPages } from "@/app/lib/data";
import Pagination from "../pagination";

export default async function UserPagination({
    query,
}: {
  query: string;
}) {
  const totalPages = await fetchUsersPages(query);

  return (
    <div className="mt-5 flex w-full justify-center">
      <Pagination totalPages={totalPages} />
    </div>
  );
}