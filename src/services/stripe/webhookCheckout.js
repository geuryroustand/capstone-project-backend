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
    const { name, customer_email } = event.data.object;

    console.log("======Object", event.data.object);
    console.log("=================ddd", event.data.object.taxiSelected);
    console.log(
      "=========dddd===========",
      event.data.object.line_items,
      event.data.object.customer_email
    );

    res.status(200).send({ received: true });
  }
});

export default webHooCheckoutRouter;
