import { kv } from "@vercel/kv";
import { Metadata } from "next";
import { redirect } from "next/navigation";

type PageProps = {
  params: {
    id: string;
  };
};

type LinkData = {
  title: string;
  imageUrl: string;
  redirectUrl?: string;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const data = await kv.get<LinkData>(params.id);

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

export default async function ShortLinkPage({ params }: PageProps) {
  const data = await kv.get<LinkData>(params.id);

  if (!data) {
    return <p>リンクが見つかりません</p>;
  }

  redirect(data.redirectUrl || "https://shortlink-app-one.vercel.app");
}
