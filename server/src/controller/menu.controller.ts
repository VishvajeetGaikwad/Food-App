import { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Menu } from "../models/menu.model";
import { Restaurant } from "../models/restaurant.model";
import mongoose from "mongoose";

export const addMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        message: "Image is required",
      });
      return; // Exit the function after sending the response
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);

    // Create a new menu item
    const menu = await Menu.create({
      name,
      description,
      price,
      image: imageUrl,
    });

    // Find the associated restaurant
    const restaurant = await Restaurant.findOne({ user: req.id });

    if (restaurant) {
      (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id); //Same error as YT
      await restaurant.save();
    } else {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return; // Exit the function after sending the response
    }

    res.status(201).json({
      success: true,
      message: "Menu added successfully",
      menu,
    });
  } catch (error) {
    console.error("Error adding menu:", error); // Improved error logging
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const file = req.file;

    // Find the menu item by ID
    const menu = await Menu.findById(id);
    if (!menu) {
      res.status(404).json({
        success: false,
        message: "Menu not found!",
      });
      return; // Exit after sending response
    }

    // Update menu properties if provided
    if (name) menu.name = name;
    if (description) menu.description = description;
    if (price) menu.price = price;

    // Update the image if a new file is provided
    if (file) {
      const imageUrl = await uploadImageOnCloudinary(
        file as Express.Multer.File
      );
      menu.image = imageUrl;
    }

    // Save the updated menu
    await menu.save();

    // Send the success response
    res.status(200).json({
      success: true,
      message: "Menu updated",
      menu,
    });
  } catch (error) {
    console.error("Error updating menu:", error); // Improved error logging
    res.status(500).json({ message: "Internal server error" });
  }
};
