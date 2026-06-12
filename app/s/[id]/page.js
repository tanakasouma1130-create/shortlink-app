import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function getData(id) {
  const res = await fetch(`${process.env.KV_REST_API_URL}/get/link:${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`
    },
    cache: "no-store"
  });

  const json = await res.json();
  const result = json.result;

  if (!result) return null;
  if (typeof result === "string") return JSON.parse(result);
  return result;
}

export async function generateMetadata({ params }) {
  const data = await getData(params.id);

  if (!data) return { title: "詳細はこちら" };

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

  if (!data) return <p>リンクが見つかりません</p>;

  const userAgent = headers().get("user-agent") || "";

  const isBot =
    userAgent.includes("Twitterbot") ||
    userAgent.includes("facebookexternalhit") ||
    userAgent.includes("Discordbot") ||
    userAgent.includes("Slackbot");

  if (!isBot) {
    redirect(data.url);
  }

  return (
    <div style={{ background: "#000", color: "#000", height: "100vh" }}>
      移動中...
    </div>
  );
}
