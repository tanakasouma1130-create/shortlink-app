import { put } from "@vercel/blob";

export async function POST(req) {
  const form = await req.formData();
  const file = form.get("file");

  const filename = `${Date.now()}-${file.name}`;

  const blob = await put(filename, file, {
    access: "public",
  });

  return Response.json({
    url: blob.url,
  });
}
