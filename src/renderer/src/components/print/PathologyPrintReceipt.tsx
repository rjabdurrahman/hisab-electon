import React from "react";
import moment from "moment";
import { numberToWords } from "../../helpers";

interface PathologyPrintReceiptProps {
  data: any;
}

const PathologyPrintReceipt: React.FC<PathologyPrintReceiptProps> = ({ data }) => {
  if (!data) return null;

  const total = Number(data.totalAmount || 0);
  const discount = Number(data.discount || 0);
  const payable = total - discount;
  const paid = payable; // Assuming full paid for receipt
  const due = 0;

  const testIdPad = data.id?.toString().padStart(8, "0") || "00000000";
  const dateFormatted = moment(data.date).format("DD-MMM-YY");
  const timeFormatted = moment(data.date).format("h:mm A");
  
  const printDate = moment().format("DD-MMM-YY h:mm A").toUpperCase();
  const deliveryDate = moment(data.date).add(1, 'days').format("DD-MMM-YY h:mm A");

  return (
    <div className="print-receipt-container h-full p-2 text-sm max-w-[148mm] mx-auto font-sans leading-snug">
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold font-bengali tracking-wide leading-tight">
          মেহেরুন্নেছা ডায়াগনষ্টিক সেন্টার
        </h1>
        <h2 className="text-xl font-bold uppercase tracking-wider leading-tight text-black mt-1">
          MEHERUNNESSA DIAGNOSTIC CENTER
        </h2>
        <p className="text-[13px] text-black">Baganchra Bazar Sharsha Jashare</p>
        <p className="text-[14px] font-bold mt-0.5">Phone : 01790-580952</p>
      </div>

      {/* Top Details Section */}
      <div className="border border-black flex items-stretch text-[14px] font-bold">
        <div className="w-[25%] px-1 pt-0.5 uppercase tracking-tighter">Patient Copy</div>
        <div className="w-[45%] px-1 pt-0.5 text-center border-x border-black uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
          Money Receipt
        </div>
        <div className="w-[35%] px-1 pt-0.5 text-right font-medium text-[10px] whitespace-nowrap truncate uppercase">
          Print: {printDate}
        </div>
      </div>

      {/* Patient info box */}
      <div className="border border-black border-t-0 p-1.5 px-2 flex justify-between tracking-tight text-[13px]">
        <div className="w-[55%] space-y-1">
          <div className="flex">
            <span className="w-24 font-bold">Patient Id</span>
            <span>: <span className="font-bold">{testIdPad}</span></span>
          </div>
          <div className="flex">
            <span className="w-24 font-bold">Add. NO</span>
            <span>: </span>
          </div>
          <div className="flex">
            <span className="w-24 font-bold">Name</span>
            <span>: {data.patient?.name || "N/A"}</span>
          </div>
          <div className="flex">
            <span className="w-24 font-bold">Mobile</span>
            <span>: {data.patient?.phone || "000"}</span>
          </div>
          <div className="flex">
            <span className="w-24 font-bold whitespace-nowrap">Doctor Name</span>
            <span className="ml-1">: {data.doctor?.name || "Self"}</span>
          </div>
        </div>

        <div className="w-[45%] space-y-1">
          <div className="flex justify-between">
            <span className="w-12 font-bold">Date</span>
            <div className="flex-1">: <span className="font-bold">{dateFormatted}</span> <span className="float-right">{timeFormatted}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12 font-bold">Age</span>
            <span>: {data.patient?.age || "0"} Y</span>
            <span className="ml-auto">M</span>
            <span className="ml-auto pr-2">D</span>
          </div>
          <div className="flex">
            <span className="w-12 font-bold">Sex</span>
            <span>: {data.patient?.gender || "Unknown"}</span>
          </div>
        </div>
      </div>

      {/* Investigation Table */}
      <table className="w-full border border-black border-t-0 text-[13px]">
        <thead>
          <tr className="border-b border-black">
            <th className="py-1 px-1 border-r border-black font-normal w-[10%] text-center">SL No</th>
            <th className="py-1 px-1 border-r border-black font-normal w-[15%] text-left">Room No</th>
            <th className="py-1 px-2 border-r border-black font-normal w-[55%] text-left">Investigation Name</th>
            <th className="py-1 px-2 font-normal w-[20%] text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="align-top border-b border-black">
          {data.investigations?.map((inv: any, idx: number) => (
            <tr key={idx} className="">
              <td className="py-1 px-1 border-r border-black text-center">{idx + 1}</td>
              <td className="py-1 px-1 border-r border-black"></td>
              <td className="py-1 px-2 border-r border-black">{inv.name}</td>
              <td className="py-1 px-2 text-right border-l-0">
                  <div className="flex justify-between w-full">
                    <span>1</span>
                    <span>{Number(inv.price).toFixed(2)}</span>
                  </div>
              </td>
            </tr>
          ))}
          {/* Empty rows filler if needed, but lets just let it be short */}
        </tbody>
      </table>

      {/* Footer Totals */}
      <div className="flex border border-black border-t-0 text-[13px]">
        <div className="w-[65%] border-r border-black flex items-center justify-center p-4">
          <div className="border border-black rounded-[0.8rem] px-8 py-1.5 text-2xl font-black tracking-widest text-black">
            PAID
          </div>
        </div>
        <div className="w-[35%]">
          <div className="flex justify-between border-b border-black py-0.5 px-2">
            <span>Total :</span>
            <span className="font-bold">{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-black py-0.5 px-2">
            <span>Less :</span>
            <span className="font-bold">{discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-black py-0.5 px-2">
            <span>Payable :</span>
            <span className="font-bold">{payable.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-black py-0.5 px-2">
            <span className="font-bold">Paid :</span>
            <span className="font-bold">{paid.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-0.5 px-2">
            <span className="font-bold">Due :</span>
            <span className="font-bold">{due.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer Information */}
      <div className="mt-2 text-[13px] px-1 font-semibold space-y-1">
        <div>
          Inwards : <span className="font-normal capitalize">{numberToWords(payable)} Taka Only.</span>
        </div>
        <div>
          Delivery Date : <span className="font-bold">{deliveryDate}</span>
        </div>
      </div>

      <div className="mt-8 flex justify-between px-1 text-[13px]">
        <div className="self-end" />
        <div className="text-center">
          <p className="mb-0.5 leading-none">Prepared by:</p>
          <p className="font-semibold text-[14px] leading-none">Habibur</p>
        </div>
      </div>
    </div>
  );
};

export default PathologyPrintReceipt;
