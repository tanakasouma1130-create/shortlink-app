"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [message, setMessage] = useState("");
  const [needUpgrade, setNeedUpgrade] = useState(false);

  async function goPro() {
    window.location.href = "/api/checkout";
  }

  async function createLink() {
    try {
      setMessage("アップロード中...");
      setResult("");
      setNeedUpgrade(false);

      if (!file) {
        setMessage("画像を選択してください");
        return;
      }

      if (!url) {
        setMessage("飛び先URLを入力してください");
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

      const adminKey =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("admin")
          : null;

      const res = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: imageData.url,
          url,
          adminKey
        })
      });

      const createText = await res.text();

      let data = {};

      try {
        data = JSON.parse(createText);
      } catch {
        setMessage(createText);
        return;
      }

      if (!res.ok) {
        if (data.upgrade) {
          setMessage(
            "無料作成は1回までです。Proプランに加入すると無制限で作成できます。"
          );
          setNeedUpgrade(true);
          return;
        }

        setMessage("create失敗: " + createText);
        return;
      }

      setResult(`https://shortlink-app-one.vercel.app/s/${data.id}`);
      setMessage("完成！");
    } catch (e) {
      setMessage("エラー詳細: " + e.message);
    }
  }

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px"
      }}
    >
      <h1>画像付き短縮リンク作成</h1>

      <p>
        写真をアップロードするだけで、
        SNSで目立つカード付き短縮リンクを作れます。
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      <input
        placeholder="飛び先URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: "100%",
          padding: "10px"
        }}
      />

      <br />
      <br />

      <button onClick={createLink}>
        作成
      </button>

      <p>{message}</p>

      {needUpgrade && (
        <>
          <br />
          <button onClick={goPro}>
            LinkShot Pro（月額500円）に加入
          </button>
        </>
      )}

      {result && (
        <p>
          完成リンク：
          <br />
          <a href={result} target="_blank">
            {result}
          </a>
        </p>
      )}
    </div>
  );
}
