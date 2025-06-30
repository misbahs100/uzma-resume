import { getRepairMemoByMemoId } from "@/app/lib/models/repairMemo";
import PrintButton from "../PrintButton";

export default async function MemoPage({
  params,
}: {
  params: Promise<{ memoId: string }>;
}) {
  
  const {memoId} = await params;
  const memo = await getRepairMemoByMemoId(memoId);

  if (!memo) return <div className="p-8">Memo not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow print:bg-white print:shadow-none">
      <div id="memo-print-area">
        <div className="flex flex-col justify-center items-center mb-4">
          <h2 className=" text-xl">বিসমিল্লাহির রাহমানির রাহিম</h2>
          <h1 className="text-2xl font-semibold">উজমা ট্রান্সপোর্ট এজেন্সি</h1>
        </div>
        <h1 className="text-xl font-bold mb-4">গাড়ির মেরামতের বিবরণী রসিদ</h1>
        <div className="mb-4 flex justify-between">
          <div>
            <div>
              <span className="font-semibold">সিরিয়াল নংঃ </span> {memo.memoId}
            </div>
            <div>
              <span className="font-semibold">গাড়ির নাম্বারঃ </span>{" "}
              {memo.vehicleNumber}
            </div>
          </div>
          <div>
            <span className="font-semibold">তারিখঃ </span> {memo.date}
          </div>
        </div>
        <table className="w-full border mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">যন্ত্রপাতি</th>
              <th className="border p-2">পরিমান</th>
              <th className="border p-2">ইউনিট মূল্য</th>
              <th className="border p-2">উপ-সর্বমোট</th>
            </tr>
          </thead>
          <tbody>
            {memo.parts.map((p: any, idx: number) => (
              <tr key={idx}>
                <td className="border p-2">{p.part}</td>
                <td className="border p-2">{p.quantity}</td>
                <td className="border p-2">৳ {p.price}</td>
                <td className="border p-2">৳ {p.price * p.quantity}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right font-bold p-2">
                সর্বমোট =
              </td>
              <td className="border p-2 font-bold">৳ {memo.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <PrintButton />
    </div>
  );
}
