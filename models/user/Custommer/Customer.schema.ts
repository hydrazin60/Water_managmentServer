import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "custommer" | "pasale" | "destributor";
  custommerType?: "enw" | "sometime" | "regular" | "loyal";
  isActive: boolean;
  lastLogin: Date;
  logoutTime?: Date;
  createdAt: Date;
  updatedAt: Date;
  loyaltyPoints?: number;
  preferredDeliveryTime?: string;
  address?: {
    district: string;
    municipality?: string;
    city?: string;
    tole?: string;
    nearFamousPlace?: string;
    country: string;
    province: string;
    zip: string;
    cordinate?: [lat: number, long: number];
  };
  liveLocation?: {
    lat: number;
    long: number;
  };
  isOnline?: boolean;
  order?: Types.ObjectId[];
  review?: Types.ObjectId[];
  notification?: Types.ObjectId[];
  chat?: Types.ObjectId[];
  isVerified: boolean;
  JarConjumptionOnWeek: number;
  userQRCode: string;
}

export interface ISimpleCustomer extends Document {
  name: string;
  email: string;
}

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["custommer", "pasale", "destributor"],
      default: "custommer", // Added default
    },
    custommerType: {
      type: String,
      enum: ["enw", "sometime", "regular", "loyal"],
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    logoutTime: { type: Date },
    loyaltyPoints: { type: Number, default: 0 },
    preferredDeliveryTime: { type: String },
    address: {
      district: { type: String, required: true },
      municipality: { type: String },
      city: { type: String },
      tole: { type: String },
      nearFamousPlace: { type: String },
      country: { type: String, default: "Nepal" }, // Assuming Nepal based on context
      province: { type: String },
      zip: { type: String },
      cordinate: { type: [Number] }, // [lat, long]
    },
    liveLocation: {
      lat: { type: Number },
      long: { type: Number },
    },
    isOnline: { type: Boolean, default: false },
    order: [{ type: Types.ObjectId, ref: "Order" }],
    review: [{ type: Types.ObjectId, ref: "Review" }],
    notification: [{ type: Types.ObjectId, ref: "Notification" }],
    chat: [{ type: Types.ObjectId, ref: "Chat" }],
    isVerified: { type: Boolean, default: false },
    JarConjumptionOnWeek: { type: Number, default: 0 },
    userQRCode: { type: String },
  },
  {
    timestamps: true,
  }
);
const simpleCustomerSchema = new Schema<ISimpleCustomer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);
// Create models
export const Customer = mongoose.model<ICustomer>("Customer", customerSchema);
export const SimpleCustomer = mongoose.model<ISimpleCustomer>(
  "SimpleCustomer",
  simpleCustomerSchema
);
