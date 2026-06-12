import { put } from "@vercel/blob";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

function generateId() {
  return Math.random().toString(36).slice(2, 8);
}

function generateUserId() {
  return crypto.randomUUID();
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const redirectUrl = formData.get("redirectUrl");
    const image = formData.get("image");
    const adminKey = formData.get("adminKey");

    if (!image) {
      return NextResponse.json(
        { error: "画像がありません" },
        { status: 400 }
      );
    }

    if (!redirectUrl) {
      return NextResponse.json(
        { error: "リダイレクト先URLがありません" },
        { status: 400 }
      );
    }

    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/linkshot_user=([^;]+)/);
    const userId = match ? match[1] : generateUserId();

    const isAdmin = adminKey === process.env.ADMIN_KEY;
    const isPro = await kv.get(`pro:${userId}`);

    if (!isAdmin && !isPro) {
      const usage = Number((await kv.get(`usage:${userId}`)) || 0);

      if (usage >= 1) {
        return NextResponse.json(
          {
            error: "無料作成は1回までです。Proプランに加入してください。",
            upgrade: true,
          },
          { status: 402 }
        );
      }
    }

    const safeTitle = title?.trim() || "詳細はこちら";

    const blob = await put(image.name, image, {
      access: "public",
      addRandomSuffix: true,
    });

    const id = generateId();

    await kv.set(`link:${id}`, {
      title: safeTitle,
      image: blob.url,
      url: redirectUrl,
    });

    if (!isAdmin && !isPro) {
      const usage = Number((await kv.get(`usage:${userId}`)) || 0);
      await kv.set(`usage:${userId}`, usage + 1);
    }

    const shortUrl = `https://shortlink-app-one.vercel.app/s/${id}`;

    const res = NextResponse.json({ shortUrl });

    res.cookies.set("linkshot_user", userId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return res;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
