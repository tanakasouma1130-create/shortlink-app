const links = {};

export async function POST(req) {
  const body = await req.json();

  const id = Math.random().toString(36).slice(2, 8);

  links[id] = {
    image: body.image,
    url: body.url
  };

  return Response.json({
    success: true,
    id
  });
}
