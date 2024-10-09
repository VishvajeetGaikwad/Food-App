import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Multer } from "multer";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Order } from "../models/order.model";

export const createRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
    const file = req.file;

    const restaurant = await Restaurant.findOne({ user: req.id });
    if (restaurant) {
      res.status(400).json({
        success: false,
        message: "Restaurant already exist for this user",
      });
    }
    if (!file) {
      res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }
    const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
    await Restaurant.create({
      user: req.id,
      restaurantName,
      city,
      country,
      deliveryTime,
      cuisines: JSON.parse(cuisines),
      imageUrl,
    });
    res.status(201).json({
      success: true,
      message: "Restaurant Added",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.id }).populate(
      "menus"
    );
    if (!restaurant) {
      res.status(404).json({
        success: false,
        restaurant: [],
        message: "Restaurant not found",
      });
    }
    res.status(200).json({ success: true, restaurant });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
    const file = req.file as Express.Multer.File; // Ensure file is treated as a Multer File

    // Find the restaurant by the user ID
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return; // Early exit to stop further execution
    }

    // Update the restaurant properties
    restaurant.restaurantName = restaurantName;
    restaurant.city = city;
    restaurant.country = country;
    restaurant.deliveryTime = deliveryTime;
    restaurant.cuisines = JSON.parse(cuisines); // Ensure cuisines are correctly parsed

    // If there's a file, upload it and update the image URL
    if (file) {
      const imageUrl = await uploadImageOnCloudinary(file);
      restaurant.imageUrl = imageUrl;
    }

    // Save the updated restaurant document
    await restaurant.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Restaurant updated",
      restaurant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurantOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Find the restaurant associated with the user
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return; // Early exit after sending response
    }

    // Fetch the orders for the found restaurant
    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");

    // Send back the orders in response
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return; // Early exit after sending response
    }

    // Update the order status
    order.status = status;
    await order.save();

    // Respond with success message
    res.status(200).json({
      success: true,
      message: "Status updated",
      order: {
        id: order._id,
        status: order.status, // Optionally include the updated status in the response
      },
    });
  } catch (error) {
    console.error(error); // Use a logging library for better error handling
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const searchText = req.params.searchText || "";
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = ((req.query.selectedCuisines as string) || "")
      .split(",")
      .filter((cuisine) => cuisine); // Filter out empty strings

    const query: any = {};

    // Combine search conditions
    const orConditions = [];

    if (searchText) {
      orConditions.push(
        { restaurantName: { $regex: searchText, $options: "i" } },
        { city: { $regex: searchText, $options: "i" } },
        { country: { $regex: searchText, $options: "i" } }
      );
    }

    if (searchQuery) {
      orConditions.push(
        { restaurantName: { $regex: searchQuery, $options: "i" } },
        { cuisines: { $regex: searchQuery, $options: "i" } }
      );
    }

    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    if (selectedCuisines.length > 0) {
      query.cuisines = { $in: selectedCuisines };
    }

    const restaurants = await Restaurant.find(query);

    res.status(200).json({
      success: true,
      count: restaurants.length, // Include count of restaurants found
      data: restaurants,
    });
  } catch (error) {
    console.error("Search restaurant error:", error); // Improved error logging
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSingleRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id: restaurantId } = req.params; // Destructure id from params
    const restaurant = await Restaurant.findById(restaurantId).populate({
      path: "menus",
      options: { sort: { createdAt: -1 } }, // Use sort instead of options
    });

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({ success: true, restaurant });
  } catch (error) {
    console.error("Get single restaurant error:", error); // Improved error logging
    res.status(500).json({ message: "Internal server error" });
  }
};
