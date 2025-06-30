import { formatDateToLocal } from "../utils";

export const PrintVoucher = ({
  voucherData,
  type,
}: {
  voucherData: any;
  type: string;
}) => {


  const handleDebitVoucherPrint = () => {
    const {
      bookingNumber,
      vehicle,
      driver,
      pickup_address,
      dropoff_address,
      pickup_dt,
      dropoff_dt,
      return_pickup_dt,
      return_dropoff_dt,
      booking_type,
      note,
      credit_amount,
      delivery_costs_data,
      created_at,
    } = voucherData;

    const formattedDate = new Date(created_at).toLocaleDateString("bn-BD");

    const printWindow = window.open("", "", "width=900,height=650");
    const uniqueTitle = `Debit_Voucher_${bookingNumber}_${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}`;

    if (printWindow) {
      printWindow.document.write(`
      <html>
    <head>
      <title>${uniqueTitle}</title>
      <style>
        body {
          font-family: "Siyam Rupali", Arial, sans-serif;
          margin: auto;
          font-size: 14px;
          /* width: 100%; */
          max-width: 800px;
          box-sizing: border-box;
          word-wrap: break-word;
        }
        .center {
          text-align: center;
        }
        .header {
          /* margin-bottom: 8px; */
        }
        .agency-title {
          font-size: 18px;
          /* margin: 4px 0; */
        }
        .agency-address {
          font-size: 13px;
          /* margin-bottom: 10px; */
        }
        .voucher-meta {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px 20px;
          /* margin-top: 12px; */
          font-size: 14px;
        }
        .voucher-meta div {
          display: flex;
          justify-content: space-between;
          white-space: normal;
          word-break: break-word;
        }
        .voucher-meta-full {
          /* margin-top: 6px; */
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
        .voucher-meta-full span {
          display: inline-block;
          width: 48%;
          word-break: break-word;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 5px;
          table-layout: fixed;
        }
        th, td {
          border: 1px solid #000;
          /* padding: 6px; */
          text-align: center;
          word-wrap: break-word;
        }
        th:nth-child(1), td:nth-child(1) {
          width: 8%;
        }
        th:nth-child(2), td:nth-child(2) {
          width: 20%;
        }
        th:nth-child(3), td:nth-child(3) {
          width: 15%;
        }
        th:nth-child(4), td:nth-child(4) {
          width: 57%;
        }
        .note {
          margin-top: 10px;
          font-size: 13px;
          word-break: break-word;
        }
        .footer {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }
        .signature {
          text-align: center;
          margin-top: 20px;
        }
        .signature-line {
          margin-top: 20px;
          border-top: 1px solid #000;
          width: 120px;
          margin-left: auto;
          margin-right: 0;
        }
      </style>
    </head>
    <body>
      <div class="center header">
        <div style="font-size:13px;">বিসমিল্লাহির রাহমানির রাহিম</div>
        <div class="agency-title"><strong>উজ্মা ট্রান্সপোর্ট এজেন্সি</strong></div>
        <div class="agency-address">উত্তর সনিষপুর, ২নং ওয়ার্ড জাকরাবাদ, সীতাকুণ্ড, চট্টগ্রাম</div>
        <div >বিষয়ঃ বিভিন্ন খরচ প্রসঙ্গে।</div>
      </div>

      <p style="margin-top: 5px;">বরাবর, হিসাব বিভাগ <br>
      জনাব, যথাযথ সম্মান প্রদর্শন পূর্বক নিন্মে উল্লেখিত খরচের বিবরণগুলো যাচাই করে বিলটি অনুমোদন প্রদানের জন্য আবেদন জানানো যাচ্ছে।</p>

      <div class="voucher-meta">
        <div><span>ভাউচার নং:</span><span>${bookingNumber}</span></div>
        <div><span>তারিখ:</span><span>${formattedDate}</span></div>
        <div><span>গাড়ি নং:</span><span>${vehicle}</span></div>
        <div><span>ড্রাইভার:</span><span>${driver}</span></div>
        <div><span>ভাড়া ধরন:</span><span>${booking_type}</span></div>
      </div>

      <div class="voucher-meta-full">
        <span><strong>পিকআপ ঠিকানা:</strong> ${pickup_address}</span>
        <span><strong>ড্রপ-অফ ঠিকানা:</strong> ${dropoff_address}</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>ক্রমিক নং</th>
            <th>বিবরণী</th>
            <th>টাকা</th>
            <th>মন্তব্য</th>
          </tr>
        </thead>
        <tbody id="voucher-body">
        </tbody>
      </table>

      <div class="note"><strong>নোট:</strong> ${note || "N/A"}</div>

      <div class="footer">
        <div>তারিখঃ ${formattedDate}</div>
        <div class="signature">
          <div class="signature-line"></div>
          <div>নিবেদক</div>
        </div>
      </div>
    </body>
  </html>

      `);

      printWindow.document.close();
      printWindow.onload = () => {
        const tbody = printWindow.document.getElementById("voucher-body");
        let totalCosts = 0;

        if (!delivery_costs_data || delivery_costs_data.length === 0) {
          const emptyRow = printWindow.document.createElement("tr");
          emptyRow.innerHTML = `
            <td colspan="4" style="text-align: center; border: 1px solid black">কোনো তথ্য নেই</td>
          `;
          tbody?.appendChild(emptyRow);
        } else {
          delivery_costs_data.forEach(
            (
              item: {
                cost_reason: string;
                cost: number;
                remarks: string;
              },
              index: number
            ) => {
              const row = printWindow.document.createElement("tr");
              
              totalCosts += Number(item.cost);

              row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.cost_reason}</td>
            <td>${item.cost}</td>
            <td>${item.remarks}</td>
          `;
              tbody?.appendChild(row);
            }
          );
        }

        const totalRow = printWindow.document.createElement("tr");
        totalRow.innerHTML = `
            <td colspan="2"><strong>মোটঃ</strong></td>
            <td>${totalCosts}</td>
            <td></td>
        `;
        const creditRow = printWindow.document.createElement("tr");
        creditRow.innerHTML = `
            <td colspan="2"><strong>অগ্রিমঃ</strong></td>
            <td>${credit_amount}</td>
            <td></td>
        `;
        const devitRow = printWindow.document.createElement("tr");
        devitRow.innerHTML = `
            <td colspan="2"><strong>ডেভিটঃ</strong></td>
            <td>${Number(credit_amount) - Number(totalCosts)}</td>
            <td></td>
        `;

        tbody?.appendChild(totalRow);
        tbody?.appendChild(creditRow);
        tbody?.appendChild(devitRow);
      };
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      console.error("Print window could not be opened.");
    }
  };

  const handleDeliveryChallanPrint = () => {
    const {
      bookingNumber,
      challanNumber,
      customer,
      customer_bin,
      customer_address,
      vehicle,
      driver,
      pickup_address,
      pickup_dt,
      dropoff_dt,
      return_pickup_dt,
      return_dropoff_dt,
      booking_type,
      note,
      challan_data,
      created_at,
    } = voucherData;

    const formattedDate = new Date(pickup_dt).toLocaleDateString("bn-BD");

    const printWindow = window.open("", "", "width=900,height=650");
    const uniqueTitle = `Delivery_Challan_${bookingNumber}_${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}`;

    if (printWindow) {
      printWindow.document.write(`
      <html>
  <head>
    <title>${uniqueTitle}</title>
    <style>
      body {
        font-family: "Siyam Rupali", Arial, sans-serif;
        margin: auto;
        /* font-size: 14px; */
        /* width: 100%; */
        max-width: 800px;
        box-sizing: border-box;
        word-wrap: break-word;
      }
      .center {
        text-align: center;
      }
      .header {
        /* margin-bottom: 8px; */
        line-height: 20px;
      }
      .agency-title {
        font-size: 15px;
        margin: 4px 0;
      }
      .agency-address {
        font-size: 13px;
        margin-bottom: 10px;
      }
      .voucher-meta {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px 40px;
        /* margin-top: 12px; */
        font-size: 13px;
      }
      .voucher-meta div {
        display: flex;
        white-space: normal;
        word-break: break-word;
      }
      .voucher-meta-full {
        /* margin-top: 6px; */
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
      .voucher-meta-full span {
        display: inline-block;
        width: 48%;
        word-break: break-word;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
        font-size: 10px;
        table-layout: fixed;
      }

      thead tr,
      tbody tr:nth-child(1) {
        border: 1px solid #000;
      }

      th {
        border: 1px solid #000;
        /* padding: 4px; */
        text-align: center;
      }

      td {
        text-align: center;
        /* padding: 6px 4px; */
        font-size: 11px;
      }

      tbody tr:not(:first-child):not(:last-child) td {
        /* border-left: none; */
        /* border-right: none; */
        border-top: none;
        border-right: 1px solid #000;
        border-left: 1px solid #000;
      }

      tbody tr:last-child td {
        border-top: 1px solid #000;
        border-bottom: 1px solid #000;
        font-weight: bold;
        text-align: right;
        padding-right: 8px;
      }
      th:nth-child(1),
      td:nth-child(1),
      th:nth-child(3),
      td:nth-child(3),
      th:nth-child(7),
      td:nth-child(7),
      th:nth-child(9),
      td:nth-child(9) {
        width: 4%;
      }
      th:nth-child(4),
      td:nth-child(4),
      th:nth-child(5),
      td:nth-child(5) {
        width: 6%;
      }
      th:nth-child(6),
      td:nth-child(6) {
        width: 8%;
      }

      .note {
        margin-top: 14px;
        font-size: 13px;
        word-break: break-word;
      }
      .footer {
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
        font-size: 13px;
      }
      .signature {
        text-align: center;
        margin-top: 30px;
      }
      .signature-line {
        margin-top: 30px;
        border-top: 1px solid #000;
        width: 120px;
        margin-left: auto;
        margin-right: 0;
      }
    </style>
  </head>
  <body>
    <div class="center header">
      <div style="font-size: 13px">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</div>
      <div style="font-size: 20px">কর চালানপত্র</div>
      <div style="font-size: 15px">
        [বিধি ৪৩ এর উপ-বিধি (১) এর দফা (গ) ও (চ) দ্রষ্টব্য]
      </div>
      <div class="agency-title">
        নিবন্ধিত ব্যক্তির নামঃ <strong>উজমা ট্রান্সপোর্ট এজেন্সি</strong>
      </div>
      <div class="agency-title">
        নিবন্ধিত ব্যক্তির বিআইএনঃ <strong>০০২৭০৭১৯৩-০৫০৩</strong>
      </div>
      <div class="agency-address">
        চালানপত্র ইস্যুর ঠিকানাঃ ${pickup_address}
      </div>
    </div>

    <div class="voucher-meta">
      <div><span>ক্রেতার নাম:</span><span>${customer}</span></div>
      <div></div>
      <div><span>ক্রেতার বিআইএনঃ:</span><span>${customer_bin}</span></div>
      <div></div>
      <div><span>ক্রেতার ঠিকানা:</span><span>${customer_address}</span></div>
      <div><span>চালানপত্র নম্বর:</span><span>${challanNumber}</span></div>
      <div>
        <span>সরবরাহের গন্তব্যস্থল:</span><span>${customer_address}</span>
      </div>
      <div><span>ইস্যুর তারিখ:</span><span>${formattedDate}</span></div>
      <div><span>যানবাহনের প্রকৃতি ও নম্বর:</span><span>${vehicle}</span></div>
      <div><span>ইস্যুর সময়:</span><span>${formatDateToLocal(
        created_at
      )}</span></div>
    </div>

    <table>
      <thead>
        <tr>
          <th>ক্রঃ নং</th>
          <th>পণ্য বা সেবার বর্ণনা (প্রযোজ্য ক্ষেত্রে ব্র্যান্ড নাম সহ)</th>
          <th>সরবরাহের একক</th>
          <th>পরিমাণ</th>
          <th>একক মূল্য (টাকায়)</th>
          <th>মোট মূল্য (টাকায়)</th>
          <th>সম্পূরক শুল্কের হার</th>
          <th>সম্পূরক শুল্কের পরিমাণ (টাকায়)</th>
          <th>মূল্য সংযোজন করের হার/সুনির্দিষ্ট কর</th>
          <th>মূল্য সংযোজন কর/সুনির্দিষ্ট করের পরিমাণ (টাকায়)</th>
          <th>সকল প্রকার শুল্ক ও করসহ মূল্য</th>
        </tr>
      </thead>
      <tbody id="challan-body">
        <tr>
          <td style="border: 1px solid black">(১)</td>
          <td style="border: 1px solid black">(২)</td>
          <td style="border: 1px solid black">(৩)</td>
          <td style="border: 1px solid black">(৪)</td>
          <td style="border: 1px solid black">(৫)</td>
          <td style="border: 1px solid black">(৬)</td>
          <td style="border: 1px solid black">(৭)</td>
          <td style="border: 1px solid black">(৮)</td>
          <td style="border: 1px solid black">(৯)</td>
          <td style="border: 1px solid black">(১০)</td>
          <td style="border: 1px solid black">(১১)</td>
        </tr>
        
      </tbody>
    </table>

    <div class="note">
      <strong>প্রতিষ্ঠান কর্তৃপক্ষের দায়িত্তপ্রাপ্ত ব্যক্তির নাম:</strong>
    </div>
    <div class="note"><strong>পদবি:</strong></div>
    <div class="note"><strong>স্বাক্ষর:</strong></div>

    <div class="footer">
      <div style="border-top: 1px solid #000">"সকল প্রকার কর ব্যতিত মূল্য"</div>
    </div>


    
  </body>
</html>

      `);

      printWindow.document.close();
      printWindow.onload = () => {
        const tbody = printWindow.document.getElementById("challan-body");
        let totalFinal = 0;
        let sumOfTotals = 0,
          sumOfSDAmounts = 0,
          sumOfVATAmounts = 0;

        if (!challan_data || challan_data.length === 0) {
          const emptyRow = printWindow.document.createElement("tr");
          emptyRow.innerHTML = `
            <td colspan="11" style="text-align: center; border: 1px solid black">কোনো তথ্য নেই</td>
          `;
          tbody?.appendChild(emptyRow);
        } else {
          challan_data.forEach(
            (
              item: {
                unit_price: number;
                quantity: number;
                supplementary_duty_rate: number;
                value_added_tax_rate: number;
                item_detail: string;
                delivery_unit: string;
              },
              index: number
            ) => {
              const row = printWindow.document.createElement("tr");
              const total = item.unit_price * item.quantity;
              const sdAmount = (total * item.supplementary_duty_rate) / 100;
              const vatAmount = (total * item.value_added_tax_rate) / 100;

              sumOfTotals += total;
              sumOfSDAmounts += sdAmount;
              sumOfVATAmounts += vatAmount;
              totalFinal += total + sdAmount + vatAmount;

              row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.item_detail}</td>
            <td>${item.delivery_unit}</td>
            <td>${item.quantity}</td>
            <td>${item.unit_price}</td>
            <td>${total}</td>
            <td>${item.supplementary_duty_rate}%</td>
            <td>${sdAmount.toFixed(2)}</td>
            <td>${item.value_added_tax_rate}%</td>
            <td>${vatAmount.toFixed(2)}</td>
            <td>${(total + sdAmount + vatAmount).toFixed(2)}</td>
          `;
              tbody?.appendChild(row);
            }
          );
        }

        const totalRow = printWindow.document.createElement("tr");
        totalRow.innerHTML = `
          <td colspan="5" style="text-align: right; border-left: 1px solid black"><strong>সর্বমোটঃ</strong></td>
          <td style="border-left: 1px solid black">${sumOfTotals}</td>
          <td style="border-left: 1px solid black"></td>
          <td style="border-left: 1px solid black">${sumOfSDAmounts}</td>
          <td style="border-left: 1px solid black"></td>
          <td style="border-left: 1px solid black">${sumOfVATAmounts}</td>
          <td style="border-left: 1px solid black; border-right: 1px solid #000">${totalFinal}</td>
        `;
        tbody?.appendChild(totalRow);
      };
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      console.error("Print window could not be opened.");
    }
  };

  if (type === "delivery_challan") {
    handleDeliveryChallanPrint();
  } else if (type === "debit_voucher") {
    handleDebitVoucherPrint();
  }
};
