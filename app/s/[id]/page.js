import { kv } from "@vercel/kv";
import { redirect } from "next/navigation";

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

  redirect(data.redirectUrl);
}
