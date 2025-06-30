import { deleteOffice } from "@/app/lib/actions";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function CreateOffice() {
  return (
    <Link
      href="/dashboard/offices/create"
      className="flex h-10 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Office</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateBranch({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/offices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteBranch({ id }: { id: string }) {
  const deleteBranchWithId = deleteOffice.bind(null, id);

  return (
    <form action={deleteBranchWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-red-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}
