import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import { Metadata } from "next";
import { fetchUsersPages } from "@/app/lib/data";
import { CreateUser } from "@/app/ui/users/buttons";
import UsersTable from "@/app/ui/users/table";
import { PaginationSkeleton, UsersTableSkeleton } from "@/app/ui/skeletons";
import UserPagination from "@/app/ui/users/pagination";
import { auth, getUser } from "@/auth";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Users",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const session = await auth();
  let userInfo = null;
  if (session?.user?.email) {
    userInfo = await getUser(session.user.email);
  }

  if (userInfo?.user_role !== "admin" || !session?.user?.email) {
    notFound()
    return;
  }


  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Users</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search users..." />
        <CreateUser />
      </div>
      <Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
        <UsersTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Suspense fallback={<PaginationSkeleton />}>
          <UserPagination query={query} />
        </Suspense>
      </div>
    </div>
  );

}
