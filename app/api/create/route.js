export async function POST(req) {
  const body = await req.json();

  const id = Math.random().toString(36).substring(2, 8);

  return Response.json({
    id,
    image: body.image,
    url: body.url
  });
}
