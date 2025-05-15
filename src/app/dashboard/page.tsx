import React from "react";
import Banner from "./_components/Banner";
import { banner } from "./_utils/banners";
import Matches from "./_components/Matches";
import { sampleMatches } from "./_utils/matches";
import Watchlist from "./_components/WatchList";
// import DailyReaders from "./_components/DailyLeaders";
// import LatestNews from "./_components/LatestNews";

// const data = [
//   { date: "12 Dec", performance: 40, color: "#9320DE99" },
//   { date: "17 Dec", performance: 70, color: "#BB55FF" },
//   { date: "25 Dec", performance: 100, color: "#BB55FF" },
//   { date: "31 Dec", performance: 60, color: "#682495" },
//   { date: "05 Jan", performance: 90, color: "#682495" },
//   { date: "14 Jan", performance: 80, color: "#BB55FF" },
//   { date: "20 Jan", performance: 75, color: "#682495" },
// ];

const Dashboard = () => {
  return (
    <div className="flex px-8 py-5 gap-4">
      {/* left content */}
      <div className="flex-[3] flex flex-col gap-6">
        <Banner {...banner} />
        <Matches matches={sampleMatches} />
        {/* <div className="flex flex-col gap-6 lg:flex-row">
          <PerformanceChart data={data} />
          <WinLossChart wins={10} losses={3} />
        </div>
        <TeamRankings /> */}
        {/* <LatestNews /> */}
        <Watchlist/>
      </div>
      {/* right bar */}
      {/* <div className="flex flex-col flex-1 gap-6">
        <DailyReaders />
      </div> */}
    </div>
  );
};

export default Dashboard;
