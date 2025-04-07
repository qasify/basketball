import React, { FC, MouseEvent, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../Tooltip";
import Button from "../Button/Button";

interface Props {
  icon: ReactNode;
  handleClick: (event: MouseEvent<HTMLDivElement>) => void;
  tooltip: string;
}

const TooltipIconButton: FC<Props> = ({ icon, handleClick, tooltip }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          icon={icon}
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            handleClick(e);
          }}
          className="!p-1 rounded bg-borderPurple/30"
        />
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-black">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipIconButton;
