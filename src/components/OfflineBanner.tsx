"use client";

import { useEffect, useState } from "react";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(typeof navigator !== "undefined" && !navigator.onLine);

    function onOffline() {
      setOffline(true);
    }
    function onOnline() {
      setOffline(false);
    }

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <>
      <div
        aria-hidden
        className="shrink-0"
        style={{
          height: "calc(2.75rem + env(safe-area-inset-top, 0px))",
        }}
      />
      <div
        className="fixed left-0 right-0 top-0 z-[60] border-b border-amber-500/35 bg-amber-50 px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top,0px))] text-center text-sm font-medium text-amber-950 shadow-sm"
        role="status"
        aria-live="polite"
      >
        You appear offline — reconnect to save or load new pages.
      </div>
    </>
  );
}
