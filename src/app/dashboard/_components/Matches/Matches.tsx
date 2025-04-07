"use client";
import { useState } from "react";
import { Match } from "../../_types";
import MatchCard from "./MatchCard";
import Pagination from "@/components/Pagination";

type MatchesProps = {
  matches: Match[];
};

const Matches: React.FC<MatchesProps> = ({ matches }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(matches.length / itemsPerPage);

  const paginatedMatches = matches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const onClick = (match?: Match) => {
    console.log(match);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="flex flex-col gap-5 text-white">
      <h2 className="text-2xl font-bold uppercase">Latest Matches</h2>
      <div className="flex gap-4 flex-wrap">
        {paginatedMatches.map((match, index) => (
          <MatchCard key={index} match={match} onClick={onClick} />
        ))}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Matches;
