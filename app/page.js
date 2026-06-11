"use client";

import { useState } from "react";

export default function Home() {
const [file, setFile] = useState(null);
const [url, setUrl] = useState("");
const [result, setResult] = useState("");
const [message, setMessage] = useState("");

async function createLink() {
try {
setMessage("作成中...");

```
  if (!file) {
    setMessage("画像を選択してください");
    return;
  }

  const form = new FormData();
  form.append("file", file);

  const upload = await fetch("/api/upload", {
    method: "POST",
    body: form,
  });

  const imageData = await upload.json();

  if (!upload.ok) {
    setMessage(
      "upload失敗: " +
      JSON.stringify(imageData)
    );
    return;
  }

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

  if (!res.ok) {
    setMessage(
      "create失敗: " +
      JSON.stringify(data)
    );
    return;
  }

  setResult(
    `${location.origin}/s/${data.id}`
  );

  setMessage("完成！");
} catch (e) {
  setMessage(
    "エラー: " + e.message
  );
}
```

}

return (
<div
style={{
maxWidth: "500px",
margin: "50px auto",
padding: "20px",
}}
> <h1>OGP短縮リンク作成</h1>

```
  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setFile(e.target.files[0])
    }
  />

  <br />
  <br />

  <input
    placeholder="飛び先URL"
    value={url}
    onChange={(e) =>
      setUrl(e.target.value)
    }
    style={{
      width: "100%",
      padding: "10px",
    }}
  />

  <br />
  <br />

  <button onClick={createLink}>
    作成
  </button>

  <p>{message}</p>

  {result && (
    <p>
      <a href={result}>
        {result}
      </a>
    </p>
  )}
</div>
```

);
}
