import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CheckoutSessionRequest = {
  cartItems: {
    menuId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  deliveryDetails: {
    name: string;
    email: string;
    address: string;
    city: string;
  };
  restaurantId: string;
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find orders associated with the user and populate references
    const orders = await Order.find({ user: req.id })
      .populate("user")
      .populate("restaurant");

    // If no orders are found, send an appropriate response
    if (!orders || orders.length === 0) {
      res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
      return; // Exit after sending the response
    }

    // Send success response with orders data
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    // Improved error logging
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createCheckoutSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body; // Make sure this type is correctly defined
    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    ).populate("menus");

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
      return; // Exit after sending the response
    }

    const order: any = new Order({
      restaurant: restaurant._id,
      user: req.id,
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      status: "pending",
    });

    // Get menu items and create line items for Stripe
    const menuItems = restaurant.menus;
    const lineItems = createLineItems(checkoutSessionRequest, menuItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["GB", "US", "CA"],
      },
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order/status`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: order._id.toString(),
        images: JSON.stringify(menuItems.map((item: any) => item.image)),
      },
    });

    if (!session.url) {
      res.status(400).json({
        success: false,
        message: "Error while creating session",
      });
      return;
    }

    await order.save();

    // Send back the session details
    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const stripeWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  let event;

  try {
    const signature = req.headers["stripe-signature"];
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;

    // Generate test header string for event construction
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    // Construct the event using the payload string and header
    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    res.status(400).send(`Webhook error: ${error.message}`);
    return; // Ensure you exit the function early if there's an error
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object as Stripe.Checkout.Session;
      const order = await Order.findById(session.metadata?.orderId);

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return; // Exit if the order is not found
      }

      // Update the order with the amount and status
      if (session.amount_total) {
        order.totalAmount = session.amount_total;
      }
      order.status = "confirmed";

      await order.save();
    } catch (error) {
      console.error("Error handling event:", error);
      res.status(500).json({ message: "Internal Server Error" });
      return; // Exit if there's an error saving the order
    }
  }

  // Send a 200 response to acknowledge receipt of the event
  res.status(200).send();
};
export const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: any
) => {
  // 1. create line items
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item: any) => item._id.toString() === cartItem.menuId
    );
    if (!menuItem) throw new Error(`Menu item id not found`);

    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: menuItem.name,
          images: [menuItem.image],
        },
        unit_amount: menuItem.price * 100,
      },
      quantity: cartItem.quantity,
    };
  });
  // 2. return lineItems
  return lineItems;
};
