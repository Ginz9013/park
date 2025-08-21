import { useEffect, useState } from "react";

const useHiRes = () => {
  const [isHiRes, setIsHiRes] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsHiRes(window.innerWidth > 1920); // 針對 1080p 以上的螢幕
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return { isHiRes };
};

export default useHiRes;