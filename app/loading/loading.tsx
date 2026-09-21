"use client";
import { BobbingDots } from "@/components/bobbing-dots";
import { useEffect } from "react";

const loading = () => {
  useEffect(() => {
    setTimeout(() => {
      // window.location.href = "/";
    }, 6000);
  }, []);
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <BobbingDots className="size-10" />
      <p>Hang on tight for a moment...</p>
    </div>
  );
};
export default loading;
