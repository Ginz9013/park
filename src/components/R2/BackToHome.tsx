import React from "react";
import { cn } from "@/lib/utils";
import { House } from "lucide-react";
import { useNavigate } from "react-router-dom";


type BackToHomeProps = {
  positionStyle?: string;
  className?: string;
}
const BackToHome: React.FC<BackToHomeProps> = ({ positionStyle, className }) => {

  const navigate = useNavigate();

  const handleToHomePage = () => navigate("/");

  return (
    <button className={cn(
      positionStyle,
      "bg-black/80 hover:bg-black/70 text-white p-3 rounded-xl transition-all duration-300 backdrop-blur-sm",
      className,
    )}
    onClick={handleToHomePage}
    >
      <House className="!size-5 md:!size-10" />
    </button>
  );
}

export default BackToHome;