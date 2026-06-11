export async function POST(req) {
  try {
    const body = await req.json();

    const id = Math.random().toString(36).substring(2, 8);

    const redisUrl = process.env.KV_REST_API_URL;
    const redisToken = process.env.KV_REST_API_TOKEN;

    if (!redisUrl) {
      return Response.json(
        { error: "KV_REST_API_URL がありません" },
        { status: 500 }
      );
    }

    if (!redisToken) {
      return Response.json(
        { error: "KV_REST_API_TOKEN がありません" },
        { status: 500 }
      );
    }

    const save = await fetch(`${redisUrl}/set/link:${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: body.image,
        url: body.url
      })
    });

    if (!save.ok) {
      const text = await save.text();

      return Response.json(
        { error: "KV保存失敗", detail: text },
        { status: 500 }
      );
    }

    return Response.json({ id });
  } catch (e) {
    return Response.json(
      { error: e.message },
      { status: 500 }
    );
  }
}
