import { kv } from "@vercel/kv";

export async function POST(req) {
  const body = await req.json();

  const id = Math.random().toString(36).substring(2, 8);

  await kv.set(`link:${id}`, {
    image: body.image,
    url: body.url
  });

  return Response.json({ id });
}
