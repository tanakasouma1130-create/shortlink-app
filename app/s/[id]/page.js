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

  const json = await res.json();
  const result = json.result;

  if (!result) return null;

  if (typeof result === "string") {
    return JSON.parse(result);
  }

  return result;
}

export async function generateMetadata({ params }) {
  const data = await getData(params.id);

  if (!data) {
    return {
      title: "リンクが見つかりません"
    };
  }

  return {
    title: "詳細はこちら",
    description: "タップして開く",
    openGraph: {
      title: "詳細はこちら",
      description: "タップして開く",
      images: [data.image],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: "詳細はこちら",
      description: "タップして開く",
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
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            setTimeout(() => {
              location.href = "${data.url}";
            }, 500);
          `
        }}
      />
      <div style={{ padding: "30px" }}>
        <h1>移動中...</h1>
      </div>
    </>
  );
}
