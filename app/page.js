"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [upgrade, setUpgrade] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const adminKey = params.get("admin");

    if (adminKey) {
      localStorage.setItem("admin_key", adminKey);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setShortUrl("");
    setUpgrade(false);

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

        if (data.upgrade) {
          setUpgrade(true);
        }

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

          <div style={{ marginTop: 8 }}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                const allowedTypes = [
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                ];

                if (!allowedTypes.includes(file.type)) {
                  setImage(null);
                  setImageName("");
                  setError(
                    "JPEG / PNG / WebP の画像を選んでください"
                  );
                  return;
                }

                setImage(file);
                setImageName(file.name);
                setError("");
              }}
            />
          </div>

          {image && (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                style={{
                  width: 32,
                  height: 32,
                  objectFit: "cover",
                }}
              />

              <span>{imageName}</span>
            </div>
          )}
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

      {upgrade && (
        <a
          href="/api/checkout"
          style={{
            display: "inline-block",
            marginTop: 12,
            padding: "10px 16px",
            background: "black",
            color: "white",
            textDecoration: "none",
            borderRadius: 8,
          }}
        >
          Proに登録する
        </a>
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
