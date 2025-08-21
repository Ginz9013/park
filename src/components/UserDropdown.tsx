import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

function UserDropdown() {
  const { isAuthenticated, userData } = useAuth();

  if (!isAuthenticated || !userData) return null;

  return (
    <div className="absolute top-[2%] md:top-[2%] left-16 md:left-20 z-30 font-RobotoRegular ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex flex-col gap-2 justify-center items-center">
            <button className="  shadow-blue-200  rounded-lg border border-white flex gap-2 text-white px-4 py-2 font-semibold shadow hover:bg-gray-600 transition">
              <img src="./images/Diamond.png" alt="" className="w-6" />
              <p className="text-sm">Your current points: {userData?.points}</p>
            </button>
            <p className="text-xs text-gray-100 absolute top-12 w-68 -left-14">
              More points you have, more chances you win!
            </p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>
            <div>
              <div className="font-bold">{userData?.email}</div>
              <div className="text-xs text-gray-500">
                {userData?.firstName} {userData?.lastName}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserDropdown;
