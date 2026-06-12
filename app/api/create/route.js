export async function POST(req) {
  try {
    const body = await req.json();

    const redisUrl = process.env.KV_REST_API_URL;
    const redisToken = process.env.KV_REST_API_TOKEN;

    if (!redisUrl) {
      return Response.json({ error: "KV_REST_API_URL がありません" }, { status: 500 });
    }

    if (!redisToken) {
      return Response.json({ error: "KV_REST_API_TOKEN がありません" }, { status: 500 });
    }

    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/linkshot_user=([^;]+)/);

    let userId = match?.[1];
    const headers = {};

    if (!userId) {
      userId = Math.random().toString(36).substring(2, 12);
      headers["Set-Cookie"] = `linkshot_user=${userId}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
    }

    const countRes = await fetch(`${redisUrl}/get/usage:${userId}`, {
      headers: { Authorization: `Bearer ${redisToken}` }
    });

    const countText = await countRes.text();
    let count = 0;

    try {
      const parsed = JSON.parse(countText);
      count = Number(parsed.result || 0);
    } catch {
      count = 0;
    }

    if (count >= 1) {
      return Response.json(
        {
          error: "無料作成は1回までです。Proプランに加入してください。",
          upgrade: true
        },
        { status: 402, headers }
      );
    }

    const id = Math.random().toString(36).substring(2, 8);

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
      return Response.json({ error: "KV保存失敗", detail: text }, { status: 500, headers });
    }

    await fetch(`${redisUrl}/set/usage:${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(count + 1)
    });

    return Response.json({ id }, { headers });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
