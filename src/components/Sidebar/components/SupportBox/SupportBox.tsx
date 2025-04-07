"use client";
import Image from "next/image";
import Card from "@/components/Card";
import { IoMdClose } from "react-icons/io";

export default function SupportBox() {
  const onClose = () => {
    // TODO: onClose click action
  };

  return (
    <Card className="relative flex gap-3 text-white flex-col">
      <div className="flex items-center space-x-2">
        <Image
          src={"/icons/sidebar/supportIcon.png"}
          alt={"support"}
          width={24}
          height={24}
        />
        <p className="font-medium text-base">Need Support?</p>
      </div>
      <p className="text-sm">Contact with one of our experts to get support.</p>
      <IoMdClose
        size={20}
        className="absolute top-4 right-4 cursor-pointer"
        onClick={onClose}
      />
    </Card>
  );
}
