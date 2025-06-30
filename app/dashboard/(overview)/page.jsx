import CardWrapper from "@/app/ui/dashboard/cards";
import ChartWrapper from "@/app/ui/dashboard/charts";
import { CardSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

export default async function Page() {
  return (
    <>
      <Suspense fallback={<CardSkeleton />}>
        <CardWrapper />
      </Suspense>

      <Suspense fallback={<CardSkeleton />}>
        <ChartWrapper />
      </Suspense>
    </>
  );
}
