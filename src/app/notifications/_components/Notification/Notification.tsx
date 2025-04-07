import React from "react";
import { Notification as NotificationType } from "../../_types";
import Button from "@/components/Button";
import { IoMdClose } from "react-icons/io";
import { formatTimestamp, timeAgo } from "@/utils/helpers/formatTimeStamp";

type NotificationProps = NotificationType;

const Notification: React.FC<NotificationProps> = ({
  id,
  timeStamp,
  title,
  description,
}) => {
  return (
    <div
      key={id}
      className="flex border-b-[0.5px] border-white items-center justify-between pb-[22px]"
    >
      <div className="flex items-center gap-[33px]">
        {/* button div */}
        <Button
          className="h-10 w-10 !p-[4px] rounded-[3px]"
          title=""
          icon={<IoMdClose size={48} />}
        />
        {/* content div */}
        <div className="flex flex-col text-white gap-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-textLight text-base">{description}</p>
          <p className="text-sm">{formatTimestamp(timeStamp)}</p>
        </div>
      </div>

      {/* time ago div */}
      <div className="flex h-full flex-col justify-between items-end">
        <div className="h-4 w-4 rounded-full bg-purpleFill"></div>
        <p>{timeAgo(timeStamp)}</p>
      </div>
    </div>
  );
};

export default Notification;
