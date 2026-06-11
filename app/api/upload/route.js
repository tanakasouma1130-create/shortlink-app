import { put } from "@vercel/blob";

export async function POST(req) {
  const form = await req.formData();
  const file = form.get("file");

  const blob = await put(file.name, file, {
    access: "public",
  });

  return Response.json({
    url: blob.url,
  });
}
