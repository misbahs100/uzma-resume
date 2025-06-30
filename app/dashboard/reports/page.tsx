import { lusitana } from "@/app/ui/fonts";
import { Metadata } from "next";
import ReportPageWithButtons from "./report";

export const metadata: Metadata = {
  title: "Reports",
};

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between mb-4">
        <h1 className={`${lusitana.className} text-2xl`}>Reports</h1>
      </div>

      <ReportPageWithButtons />
    </div>
  );
}
