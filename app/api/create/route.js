import { put } from "@vercel/blob";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

function generateId() {
  return Math.random().toString(36).slice(2, 8);
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const redirectUrl = formData.get("redirectUrl");
    const image = formData.get("image");

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

    const safeTitle = title?.trim() || "詳細はこちら";

    const blob = await put(image.name, image, {
      access: "public",
    });

    const id = generateId();

    await kv.set(id, {
      title: safeTitle,
      imageUrl: blob.url,
      redirectUrl,
    });

    const shortUrl = `https://shortlink-app-one.vercel.app/s/${id}`;

    return NextResponse.json({ shortUrl });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "APIエラーが発生しました",
      },
      { status: 500 }
    );
  }
}
