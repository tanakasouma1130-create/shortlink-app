"use client";

import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");

  async function createLink() {
    const res = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ image, url })
    });

    const data = await res.json();
    setResult(location.origin + "/s/" + data.id);
  }

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>OGP短縮リンク作成</h1>

      <input placeholder="画像URL" value={image} onChange={(e) => setImage(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />

      <input placeholder="飛び先URL" value={url} onChange={(e) => setUrl(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />

      <button onClick={createLink} style={{ width: "100%", padding: "12px" }}>作成</button>

      {result && (
        <p>
          完成リンク：<br />
          <a href={result}>{result}</a>
        </p>
      )}
    </div>
  );
}
