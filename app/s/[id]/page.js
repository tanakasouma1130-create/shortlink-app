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
    title: "詳細はこちら",
    description: "再生するにはタップ",
    openGraph: {
      title: "詳細はこちら",
      description: "再生するにはタップ",
      images: [data.image]
    },
    twitter: {
      card: "summary_large_image",
      title: "詳細はこちら",
      description: "再生するにはタップ",
      images: [data.image]
    }
  };
}

export default async function Page({ params }) {
  const data = await kv.get(`link:${params.id}`);

  if (!data) {
    return <h1>リンクが見つかりません</h1>;
  }

  redirect(data.url);
}
