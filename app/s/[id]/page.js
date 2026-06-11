import { kv } from "@vercel/kv";
import { redirect } from "next/navigation";

export default async function Page({ params }) {
  const data = await kv.get(`link:${params.id}`);

  if (!data) {
    return <h1>リンクが見つかりません</h1>;
  }

  redirect(data.url);
}
