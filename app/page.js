"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");

  async function createLink() {
    if (!file) return alert("画像を選択");

    const form = new FormData();
    form.append("file", file);

    const upload = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    const imageData = await upload.json();

    const res = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageData.url,
        url,
      }),
    });

    const data = await res.json();

    setResult(
      `${location.origin}/s/${data.id}`
    );
  }

  return (
    <div style={{
      maxWidth:"500px",
      margin:"50px auto",
      padding:"20px"
    }}>
      <h1>OGP短縮リンク作成</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e)=>setFile(e.target.files[0])}
      />

      <br /><br />

      <input
        placeholder="飛び先URL"
        value={url}
        onChange={(e)=>setUrl(e.target.value)}
        style={{
          width:"100%",
          padding:"10px"
        }}
      />

      <br /><br />

      <button onClick={createLink}>
        作成
      </button>

      {result && (
        <p>
          <a href={result}>{result}</a>
        </p>
      )}
    </div>
  );
}
