"use client";

export default function PrintButton() {
  const handlePrint = () => {
    const printContents = document.getElementById("memo-print-area")?.innerHTML;
    if (!printContents) return;
    const printWindow = window.open("", "", "height=600,width=800");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Memo</title>
          <style>
            body { font-family: sans-serif; padding: 2rem; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; }
            th { background: #f3f3f3; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    // printWindow.close();
  };

  return (
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded print:hidden"
      onClick={handlePrint}
    >
      Print Memo
    </button>
  );
}
