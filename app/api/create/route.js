import { put } from "@vercel/blob";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

function generateId() {
  return Math.random().toString(36).slice(2, 8);
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const image = formData.get("image") as File;

  if (!image) {
    return NextResponse.json(
      { error: "画像がありません" },
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
  });

  const shortUrl = `https://shortlink-app-one.vercel.app/${id}`;

  return NextResponse.json({ shortUrl });
}
