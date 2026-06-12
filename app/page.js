"use client";

import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [image, setImage] = useState(null);
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setShortUrl("");

    if (!image) {
      setError("画像を選択してください");
      return;
    }

    if (!redirectUrl) {
      setError("リダイレクト先URLを入力してください");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("redirectUrl", redirectUrl);
      formData.append("image", image);

      const adminKey = localStorage.getItem("admin_key");

      if (adminKey) {
        formData.append("adminKey", adminKey);
      }

      const res = await fetch("/api/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "作成に失敗しました");
        return;
      }

      setShortUrl(data.shortUrl);
    } catch (err) {
      console.error(err);
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>LinkShot</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Xカードのタイトル</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：新しいお知らせ"
            style={{
              width: "100%",
              maxWidth: 400,
              padding: 8,
            }}
          />
        </div>

        <br />

        <div>
          <label>リダイレクト先URL</label>
          <br />
          <input
            type="url"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            placeholder="https://example.com"
            style={{
              width: "100%",
              maxWidth: 400,
              padding: 8,
            }}
          />
        </div>

        <br />

        <div>
          <label>OGP画像</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files?.[0] ?? null)
            }
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "作成中..." : "短縮URLを作成"}
        </button>
      </form>

      {error && (
        <p
          style={{
            color: "red",
            marginTop: 16,
          }}
        >
          {error}
        </p>
      )}

      {shortUrl && (
        <div style={{ marginTop: 24 }}>
          <p>作成されたURL</p>

          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {shortUrl}
          </a>
        </div>
      )}
    </main>
  );
}
