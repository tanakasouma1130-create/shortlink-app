async function getData(id) {
  const res = await fetch(
    `${process.env.KV_REST_API_URL}/get/link:${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`
      },
      cache: "no-store"
    }
  );

  const data = await res.json();
  return data.result;
}

export async function generateMetadata({ params }) {
  const data = await getData(params.id);

  if (!data) {
    return { title: "リンクが見つかりません" };
  }

  return {
    title: "OGPリンク",
    description: "画像付きリンク",
    openGraph: {
      title: "OGPリンク",
      description: "画像付きリンク",
      images: [data.image],
      url: data.url,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: "OGPリンク",
      description: "画像付きリンク",
      images: [data.image]
    }
  };
}

export default async function Page({ params }) {
  const data = await getData(params.id);

  if (!data) {
    return <p>リンクが見つかりません</p>;
  }

  return (
    <html>
      <body>
        <p>移動中...</p>
        <a href={data.url}>開く</a>
        <script
          dangerouslySetInnerHTML={{
            __html: `location.href = "${data.url}";`
          }}
        />
      </body>
    </html>
  );
}
