import express from "express";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const webHooCheckoutRouter = express.Router();

webHooCheckoutRouter.post("/", async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOKS_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error}`);
  }

  if (event.type === "checkout.session.completed") {
    const { name, customer_email, taxiSelected } = event.data.object;

    console.log("=========dddd===========", name, customer_email, taxiSelected);

    res.status(200).send({ received: true });
  }
});

export default webHooCheckoutRouter;
