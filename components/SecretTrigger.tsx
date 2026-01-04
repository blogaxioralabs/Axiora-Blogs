"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SecretTrigger() {
  const router = useRouter();
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    if (tapCount >= 5) {
      router.push("/secure-auth-f5a4"); // අපි නම වෙනස් කරපු ෆෝල්ඩර් එක
      setTapCount(0);
    }

    const timer = setTimeout(() => setTapCount(0), 1500);
    return () => clearTimeout(timer);
  }, [tapCount, router]);

  return (
    <span 
      onClick={() => setTapCount((prev) => prev + 1)}
      className="cursor-default select-none transition-opacity hover:opacity-80 active:scale-95 inline-block"
      title="All Rights Reserved"
    >
      &copy; {new Date().getFullYear()} Axiora Blogs.
    </span>
  );
}