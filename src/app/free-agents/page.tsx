import dynamic from "next/dynamic";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { parseFreeAgentData } from "./_utils";
import freeAgentRaw from "../../../public/data/free_agents.json";

const FreeAgentContent = dynamic(
  () => import("./_components/FreeAgentContent"),
  {
    ssr: true,
    loading: () => <div className="min-h-[500px]" />,
  }
);

export const metadata = {
  title: "Free Agent Tracker | HoopRoster",
  description:
    "European basketball free agent tracker with verified data, stats, and team openings.",
};

export default function FreeAgentsPage() {
  const data = parseFreeAgentData(freeAgentRaw);

  return (
    <div className="flex flex-col gap-5 m-5 p-5 bg-white/5 rounded-lg">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <IoMdArrowRoundBack className="text-2xl text-white hover:text-blue-500 transition-colors" />
        </Link>
        <h1 className="text-xl font-bold text-white">Free Agent Tracker</h1>
      </div>
      <FreeAgentContent data={data} />
    </div>
  );
}
