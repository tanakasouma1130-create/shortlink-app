"use client";

import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [shortUrl, setShortUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!image) {
      alert("画像を選択してください");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    const res = await fetch("/api/create", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setShortUrl(data.shortUrl);
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>OGP短縮リンク作成</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Xカードのタイトル</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：新しいお知らせ"
            style={{ width: "100%", maxWidth: 400, padding: 8 }}
          />
        </div>

        <br />

        <div>
          <label>OGP画像</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
        </div>

        <br />

        <button type="submit">短縮URLを作成</button>
      </form>

      {shortUrl && (
        <div style={{ marginTop: 24 }}>
          <p>作成されたURL</p>
          <a href={shortUrl} target="_blank">
            {shortUrl}
          </a>
        </div>
      )}
    </main>
  );
}
