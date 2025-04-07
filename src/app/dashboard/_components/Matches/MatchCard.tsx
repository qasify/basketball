import React from "react";
import Image from "next/image";
import { Match } from "../../_types";

type MatchCardProps = { match: Match; onClick?: (match?: Match) => void };

const MatchCard: React.FC<MatchCardProps> = ({ match, onClick }) => {
  return (
    <div className="flex-1 bg-tileBackground text-white p-3 flex flex-col gap-4 rounded-md shadow-md w-[200px] border border-searchBorder">
      <div className="flex flex-col gap-[6px] p-[6px] text-white">
        <h3 className="text-lg font-[600]">{match?.day}</h3>
        <p className="text-[10px]">{match?.dateTime}</p>
      </div>
      <div className="flex flex-col gap-2">
        {match?.teams?.map((team, index) => (
          <React.Fragment key={index}>
            <div key={index} className="flex justify-between items-center">
              <span className="flex items-center gap-[6px]">
                <Image
                  src={team?.logo ?? "/images/home/match/teamIcon.png"}
                  alt={team.name}
                  height={16}
                  width={16}
                />
                <span className="font-semibold">{team?.name}</span>
              </span>
              <span className="font-bold">{team?.score}</span>
            </div>
            {index !== match?.teams?.length - 1 && (
              <div className="border-b border-divider"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <button
        className="w-full border border-searchBorder bg-buttonBg hover:bg-purple-600 text-white py-1 rounded-md"
        onClick={() => onClick?.(match)}
      >
        Boxscore
      </button>
    </div>
  );
};

export default MatchCard;
