"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type AppMode = "ai-generate" | "create" | "analyze" | "ai-score";

const DashboardParams = ({ setMode }: { setMode: (mode: AppMode) => void }) => {
  const searchParams = useSearchParams();
  const modeFromURL = (searchParams.get("mode") as AppMode) || "ai-generate";

  useEffect(() => {
    setMode(modeFromURL);
  }, [modeFromURL, setMode]);

  return null;
};

export default DashboardParams;