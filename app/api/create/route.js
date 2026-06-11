export async function POST(req) {
  const body = await req.json();

  const id = Math.random().toString(36).substring(2, 8);

  const redisUrl = process.env.KV_REST_API_URL;
  const redisToken = process.env.KV_REST_API_TOKEN;

  const save = await fetch(`${redisUrl}/set/link:${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`
    },
    body: JSON.stringify({
      image: body.image,
      url: body.url
    })
  });

  if (!save.ok) {
    return Response.json(
      { error: "KV保存失敗" },
      { status: 500 }
    );
  }

  return Response.json({ id });
}
