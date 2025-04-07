import Image from "next/image";
import { Leader, StatCategory } from "../../_types";

type DailyLeadersCardProps = {
  title: string;
  imageUrl: string;
  playerName: string;
  playerInfo: string;
  statCategories: StatCategory[];
  activeCategory: string;
  onCategoryChange: (key: string) => void;
  leaders: Leader[];
  date: string;
};

const DailyLeadersCard = ({
  title,
  imageUrl,
  playerName,
  playerInfo,
  statCategories,
  activeCategory,
  onCategoryChange,
  leaders,
  date,
}: DailyLeadersCardProps) => {
  return (
    <div className="flex flex-col gap-5 w-full text-white">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl uppercase font-semibold text-white">{title}</h2>
        {/* Player Image */}
        <div className="relative h-auto">
          <Image
            src={imageUrl}
            alt={playerName}
            // width={359}
            // height={0}
            // style={{ height: "auto" }}
            layout="responsive"
            width={400}
            height={200}
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-4">
          {/* Stat Category Buttons */}
          <div className="flex gap-2">
            {statCategories.map((category) => (
              <button
                key={category.key}
                onClick={() => onCategoryChange(category.key)}
                className={`p-2 text-xs font-bold uppercase border rounded bg-rankingTypeBg ${
                  activeCategory === category.key
                    ? " border-searchBorder text-white"
                    : "border-transparent text-gray-300"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Player Info */}
          <div>
            <h3 className="text-xl">{playerName}</h3>
            <p className="text-sm text-purpleFill">{playerInfo}</p>
          </div>
        </div>
        {/* Leaderboard */}
        <table className="w-full text-sm border-collapse">
          <tbody>
            {leaders.map((leader, index) => (
              <tr key={index} className="border-b border-tileBackground">
                <td className="py-1 w-2/5">{leader.name}</td>
                <td className="py-1 w-2/5 text-left">{leader.team}</td>
                <td className="py-1 w-1/5 text-right">{leader.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Date */}
        <p className="pb-3 border-b border-tileBackground text-sm text-white text-center">
          {date}
        </p>
      </div>
    </div>
  );
};

export default DailyLeadersCard;
