import mongoose from "mongoose";

export interface IUser {
  createdAt: Date;
  updatedAt: Date;
  fullname: string;
  email: string;
  password: string;
  contact: Number;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
  admin: boolean;
  lastlogin?: Date;
  isVerified?: boolean;
  resetPasswordToken?: String;
  resetPasswordTokenExpiresAt?: Date;
  verificationToken?: String;
  verificationTokenExpiresAt?: Date;
}
export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      default: "Update your addess",
    },
    city: {
      type: String,
      default: "Update your addess",
    },
    country: {
      type: String,
      default: "Update your addess",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    admin: { type: Boolean, default: false },
    //Advanced Authentication
    lastlogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: String,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
