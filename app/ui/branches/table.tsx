import Image from "next/image";
import { fetchFilteredOffices } from "@/app/lib/data";
import { DeleteBranch, UpdateBranch } from "./buttons";

export default async function BranchesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const offices = await fetchFilteredOffices(query, currentPage);
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* mobile */}
          <div className="md:hidden">
            {offices?.map((branch) => (
              <div
                key={branch.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2">
                      <p>{branch.office_name}</p>
                      <p>BIN: {branch.bin}</p>
                    </div>
                    <p className="text-sm text-gray-500">{branch.address}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b py-4">
                  <div>
                    <p>Manager:</p>
                    <div className="mb-2 flex items-center">
                      <Image
                        src="/customers/michael-novotny.png"
                        className="mr-2 rounded-full"
                        width={18}
                        height={18}
                        alt={`${branch.manager}'s profile picture`}
                      />
                      <p>
                        {branch.manager} <br /> {branch.contact}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdateBranch id={branch.id} />
                    <DeleteBranch id={branch.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* desktop */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium">
                  Office Name / BIN
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Location
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Manager
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {offices?.map((branch) => (
                <tr
                  key={branch.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {branch.office_name} <br />
                    {branch.bin}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {branch.address}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/customers/michael-novotny.png"
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${branch.manager}'s profile picture`}
                      />
                      <div>
                        <p>
                          {branch.manager} <br /> {branch.contact}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateBranch id={branch.id} />
                      <DeleteBranch id={branch.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
