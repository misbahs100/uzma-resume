import { fetchOfficeById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import EditBranchForm from "@/app/ui/branches/edit-form";
import { OfficeForm } from "@/app/lib/definitions";
import Breadcrumbs from "@/app/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Edit Branch",
};

// Ensure props are destructured and typed correctly
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Properly await the params before accessing properties

  // Fetch branch and managers data
  const [office] = await Promise.all([
    fetchOfficeById(id) as unknown as Promise<OfficeForm>,
  ]);

  if (!office) {
    return notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Offices", href: "/dashboard/offices" },
          {
            label: "Edit Office",
            href: `/dashboard/offices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditBranchForm office={office} />
    </main>
  );
}
