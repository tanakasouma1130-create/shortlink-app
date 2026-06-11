import { kv } from "@vercel/kv";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }) {
  const data = await kv.get(`link:${params.id}`);

  if (!data) {
    return {
      title: "リンクが見つかりません"
    };
  }

  return {
    title: "OGPリンク",
    description: "画像付きリンク",
    openGraph: {
      title: "OGPリンク",
      description: "画像付きリンク",
      images: [data.image],
      url: data.url
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
  const data = await kv.get(`link:${params.id}`);

  if (!data) {
    return <p>リンクが見つかりません</p>;
  }

  redirect(data.url);
}
