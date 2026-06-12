"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [message, setMessage] = useState("");

  async function createLink() {
    try {
      setMessage("アップロード中...");
      setResult("");

      if (!file) {
        setMessage("画像を選択してください");
        return;
      }

      const form = new FormData();
      form.append("file", file);

      const upload = await fetch("/api/upload", {
        method: "POST",
        body: form
      });

      const uploadText = await upload.text();

      if (!upload.ok) {
        setMessage("upload失敗: " + uploadText);
        return;
      }

      const imageData = JSON.parse(uploadText);

      setMessage("リンク作成中...");

      const res = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: imageData.url,
          url
        })
      });

      const createText = await res.text();

      if (!res.ok) {
        setMessage("create失敗: " + createText);
        return;
      }

      const data = JSON.parse(createText);

      setResult(`https://shortlink-app-one.vercel.app/s/${data.id}`);
      setMessage("完成！");
    } catch (e) {
      setMessage("エラー詳細: " + e.message);
    }
  }

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
      <h1>OGP短縮リンク作成</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <input
        placeholder="飛び先URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", padding: "10px" }}
      />

      <br /><br />

      <button onClick={createLink}>作成</button>

      <p>{message}</p>

      {result && (
        <p>
          完成リンク：<br />
          <a href={result}>{result}</a>
        </p>
      )}
    </div>
  );
}
