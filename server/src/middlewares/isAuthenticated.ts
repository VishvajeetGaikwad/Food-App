import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Explicitly define return type as Promise<void>
  try {
    const token = req.cookies.token; // Get token from cookies
    if (!token) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Verify the token
    const decode = jwt.verify(
      token,
      process.env.SECRET_KEY as string
    ) as jwt.JwtPayload; // Ensure SECRET_KEY is a string

    // Check if decoding was successful
    if (!decode || !decode.userId) {
      // Optional chaining to check userId
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.id = decode.userId; // Assign userId to request
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Authentication error:", error); // Log the error for debugging
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
