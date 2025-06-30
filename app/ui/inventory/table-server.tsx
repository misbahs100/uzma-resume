import { fetchFilteredBookings, fetchFilteredInventories } from "@/app/lib/data";
import BookingsTable from "./table";
import InventoryTable from "./table";

export default async function InventoryTableServer({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
    const inventories = await fetchFilteredInventories(query, currentPage);

  return <InventoryTable inventories={inventories} />;
}
