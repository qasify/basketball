import React from "react";
import Image from "next/image";

import Button from "@/components/Button";
import { BsDownload } from "react-icons/bs";

const DownloadReport = () => {
  return (
    <div className="flex flex-col gap-4 px-[10px] py-[15px] bg-white/5 rounded-[10px] text-white">
      <h1 className="font-[500]">Download Report</h1>
      <Button
        label={
          <div className="flex gap-2 text-xs items-center">
            <Image src={"/icons/pdf.png"} alt="pdf" width={14} height={8} />
            Downlaod PDF
          </div>
        }
        icon={<BsDownload />}
        iconAlignment="right"
        className="border-white/50 !p-[10px] rounded-md"
      />
      <Button
        label={
          <div className="flex gap-2 text-xs items-center">
            <Image src={"/icons/xls.png"} alt="xls" width={14} height={8} />
            Downlaod Excel
          </div>
        }
        icon={<BsDownload />}
        iconAlignment="right"
        className="border-white/50 !p-[10px] rounded-md"
      />
    </div>
  );
};

export default DownloadReport;
