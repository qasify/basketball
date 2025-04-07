import Image from "next/image";
import { TableColumn } from "@/types/Table";
import { Ranking, TeamRanking } from "../_types";

export const rankingColumns: TableColumn<TeamRanking>[] = [
  { key: "position", label: "Pos" },
  {
    key: "team",
    label: "Team Name",
    cellRenderer: (val, row) => {
      return (
        <div className="flex gap-[6px] items-center">
          <Image
            src={row?.flagUrl ?? ""}
            alt={val ? val?.toString() : ""}
            width={27}
            height={18}
          />
          {val}
        </div>
      );
    },
  },
  {
    key: "matches",
    label: "Matches",
  },
  {
    key: "points",
    label: "Pts",
  },
  {
    key: "rating",
    label: "Rating",
  },
];

export const rankingData: TeamRanking[] = [
  {
    position: "01",
    team: "Australia",
    flagUrl: "/images/home/flags/aus.png",
    matches: 36,
    points: 4531,
    rating: 126,
  },
  {
    position: "02",
    team: "South Africa",
    flagUrl: "/images/home/flags/sa.png",
    matches: 33,
    points: 3754,
    rating: 114,
  },
  {
    position: "03",
    team: "India",
    flagUrl: "/images/home/flags/india.png",
    matches: 39,
    points: 4248,
    rating: 109,
  },
  {
    position: "04",
    team: "England",
    flagUrl: "/images/home/flags/eng.png",
    matches: 46,
    points: 4815,
    rating: 105,
  },
  {
    position: "05",
    team: "New Zealand",
    flagUrl: "/images/home/flags/nz.png",
    matches: 33,
    points: 3216,
    rating: 97,
  },
];

export const rankingsTypes: Ranking[] = [
  { id: "1", value: "Type 1" },
  { id: "2", value: "Type 2" },
  { id: "3", value: "Type 3" },
];
