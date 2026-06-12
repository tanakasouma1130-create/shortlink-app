import { kv } from "@vercel/kv";

export async function generateMetadata({ params }) {
  const data = await kv.get(`link:${params.id}`);

  if (!data) {
    return {
      title: "リンクが見つかりません",
    };
  }

  return {
    title: data.title || "詳細はこちら",
    openGraph: {
      title: data.title || "詳細はこちら",
      images: [
        {
          url: data.image,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title || "詳細はこちら",
      images: [data.image],
    },
  };
}

export default async function ShortLinkPage({ params }) {
  const data = await kv.get(`link:${params.id}`);

  if (!data) {
    return <p>リンクが見つかりません</p>;
  }

  return (
    <main>
      <meta httpEquiv="refresh" content={`0;url=${data.url}`} />
      <p>移動中です...</p>
      <a href={data.url}>移動しない場合はこちらをクリック</a>
    </main>
  );
}
