import Image from "next/image";
import { FaChevronRight } from "react-icons/fa6";

interface UserProfileProps {
  name: string;
  email: string;
}

export default function UserProfile({ name, email }: UserProfileProps) {
  return (
    <div className="flex w-full items-center p-3 pt-6 gap-3 space-x-3 border-t border-borderLight">
      <Image
        src="/icons/avatar-placeholder.png"
        alt="User"
        width={40}
        height={40}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-textGrey">{email}</p>
      </div>
      <FaChevronRight size={16} className="text-textGrey" />
    </div>
  );
}
