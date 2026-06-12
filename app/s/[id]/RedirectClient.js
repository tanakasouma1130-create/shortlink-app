"use client";

import { useEffect } from "react";

export default function RedirectClient({ url }) {
  useEffect(() => {
    if (url) {
      window.location.replace(url);
    }
  }, [url]);

  return (
    <div style={{ background: "#000", color: "#000", height: "100vh" }}>
      移動中...
    </div>
  );
}
