import { put } from "@vercel/blob";

export async function POST(req) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return Response.json(
        { error: "BLOB_READ_WRITE_TOKEN がありません" },
        { status: 500 }
      );
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return Response.json(
        { error: "file がありません" },
        { status: 400 }
      );
    }

    const blob = await put(
      `uploads/${Date.now()}.png`,
      file,
      {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN
      }
    );

    return Response.json({
      url: blob.url
    });
  } catch (e) {
    return Response.json(
      { error: e.message },
      { status: 500 }
    );
  }
}
