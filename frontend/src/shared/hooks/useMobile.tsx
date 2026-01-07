import { useEffect, useState } from "react";

const MAX_PHONE_WIDTH = 640;

export const useMobileLayout = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < MAX_PHONE_WIDTH
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MAX_PHONE_WIDTH);
    };

    addEventListener("resize", handleResize);

    return () => removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};
