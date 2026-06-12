import { kv } from "@vercel/kv";

export async function generateMetadata({ params }) {
  const data = await kv.get(params.id);

  if (!data) {
    return {
      title: "リンクが見つかりません",
    };
  }

  return {
    title: data.title,
    openGraph: {
      title: data.title,
      images: [
        {
          url: data.imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      images: [data.imageUrl],
    },
  };
}

export default async function ShortLinkPage({ params }) {
  const data = await kv.get(params.id);

  if (!data) {
    return <p>リンクが見つかりません</p>;
  }

  return (
    <main>
      <meta httpEquiv="refresh" content={`0;url=${data.redirectUrl}`} />

      <p>移動中です...</p>

      <a href={data.redirectUrl}>
        移動しない場合はこちらをクリック
      </a>
    </main>
  );
}
