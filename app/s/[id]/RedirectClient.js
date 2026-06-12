"use client";

import { useEffect } from "react";

export default function RedirectClient({ url }) {
  useEffect(() => {
    console.log("redirect url:", url);
    if (url) {
      window.location.href = url;
    }
  }, [url]);

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <p>飛び先URL:</p>
      <p>{url || "URLなし"}</p>

      {url && <a href={url}>ここを押して開く</a>}
    </div>
  );
}
