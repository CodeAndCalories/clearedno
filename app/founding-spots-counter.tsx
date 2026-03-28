"use client";

import { useEffect, useState } from "react";

/**
 * Fetches the number of remaining founding spots from the API and displays it.
 * Falls back to "Limited spots remaining" if the request fails.
 */
export function FoundingSpotsCounter({ compact = false }: { compact?: boolean }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/founding-spots")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.remaining === "number") setRemaining(d.remaining);
      })
      .catch(() => {});
  }, []);

  if (remaining === null) {
    return compact ? <>Limited spots left</> : <>Limited founding spots remaining</>;
  }

  return compact
    ? <>Only {remaining} spots left</>
    : <>{remaining} of 20 founding spots remaining</>;
}
