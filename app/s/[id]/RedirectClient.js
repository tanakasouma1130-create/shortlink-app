"use client";

import { useEffect } from "react";

export default function RedirectClient({ url }) {
  useEffect(() => {
    if (url) {
      setTimeout(() => {
        window.location.href = url;
      }, 300);
    }
  }, [url]);

  return (
    <div style={{ background: "#000", color: "#000", height: "100vh" }}>
      移動中...
      <a href={url} style={{ color: "#000" }}>
        開く
      </a>
    </div>
  );
}
