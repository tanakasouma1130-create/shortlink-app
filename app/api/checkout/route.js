import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const origin = new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      success_url: `${origin}/?success=1`,
      cancel_url: `${origin}/?canceled=1`
    });

    return Response.redirect(session.url, 303);
  } catch (e) {
    return Response.json(
      { error: e.message },
      { status: 500 }
    );
  }
}
