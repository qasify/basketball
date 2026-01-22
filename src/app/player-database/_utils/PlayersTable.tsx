import { TableColumn } from "@/types/Table";

import Button from "@/components/Button";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { Player } from "@/_api/basketball-api";

export const playerColumns: TableColumn<Player & { action?: string }>[] = [
  {
    label: "Name",
    key: "name",
    cellRenderer: (val,row) => (
      <Link href={`/player-database/player-profile/${row.id}`}>{String(val)}</Link>
    ),
  },
  { label: "Position", key: "position" },
  { label: "Age", key: "age" },
  { label: "Country", key: "country" },
  { label: "Team", key: "team" },
  {
    label: "Action",
    key: "action",
    cellRenderer: () => {
      return (
        <div className="flex gap-2">
          <Button
            className="!p-1 rounded bg-borderPurple/30"
            icon={<FaPlus className="text-white text-xs" size={10} />}
          />
          <Button
            className="!p-1 rounded bg-borderPurple/30"
            icon={<FaEdit className="text-white text-xs" size={10} />}
          />
          <Button
            className="!p-1 rounded bg-borderPurple/30"
            icon={<FaTrash className="text-white text-xs" size={10} />}
          />
        </div>
      );
    },
  },
];
