import { useState, useEffect } from "react";

export const useResponsiveTransform = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const getTransform = (value: number) => {
    if (isMobile) {
      return `translateY(${value}%)`;
    }
    return `translateX(${value}%)`;
  };

  return { getTransform, isMobile };
};
