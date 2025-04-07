import Image from "next/image";
import Link from "next/link";

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
  height?: number;
  width?: number;
  url?: string;
}

export default function NavItem({
  icon,
  height = 18,
  width = 18,
  label,
  active,
  url = "",
}: NavItemProps) {
  return (
    <Link href={url ?? ""}>
      <div
        className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer relative transition ${
          active ? "bg-nav-gradient pl-0" : "hover:bg-borderLight"
        }`}
      >
        {active && (
          <div className="flex absolute rounded-[4px] left-[-24px] h-[20px] w-[8px] bg-nav-gradient"></div>
        )}
        <Image src={icon ?? ""} alt={label} width={width} height={height} />
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  );
}
