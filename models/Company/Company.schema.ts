import mongoose, { Schema, Document, Types, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-strong-secret-key";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "30d";
const SALT_ROUNDS = 12;

export interface ICompany extends Document {
  CompanyName: string;
  legalName: string;
  Companyemail: string;
  password: string;
  phone: string;
  owner: Types.ObjectId;
  ownerName: string;
  website?: string;
  description?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    tiktok?: string;
  };
  logo?: string;
  companyType: "drinkingWaterOnly" | "TankerOnly" | "drinkingWaterAndTanker";
  address: {
    district: string;
    municipality?: string;
    city?: string;
    tole?: string;
    nearFamousPlace?: string;
    country: string;
    province: string;
    zip: string;
    coordinates?: [number, number]; // [longitude, latitude]
  };
  establishedDate: Date;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  isActive: boolean;
  branches: Types.ObjectId[];
  StaffMembers: Types.ObjectId[];
  vehicles: Types.ObjectId[];
  products: Types.ObjectId[];
  companyDocuments?: {
    registrationNumber?: string;
    registrationCertificate?: string;
    PANNumber?: string;
    VATNumber?: string;
    VATCertificate?: string[];
    PANDocument?: string[];
    citizenshipNumber: string;
    citizenshipDocument: string[];
    otherDocuments?: string[];
  };
  bankingInfo?: {
    accountNumber: string;
    bankName: string;
    branch: string;
    QRCode?: string;
  };
  digitalWalletInfo?: {
    eSewaId?: string;
    eSewaQR?: string;
    khaltiId?: string;
    khaltiQR?: string;
  };
  totalEmployees?: number;
  revenue?: number;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    CompanyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    legalName: {
      type: String,
      required: [true, "Legal name is required"],
      trim: true,
      maxlength: [100, "Legal name cannot exceed 100 characters"],
    },
    Companyemail: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Never show in output
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v: string) {
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner reference is required"],
    },
    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
      trim: true,
    },
    website: {
      type: String,
      validate: [validator.isURL, "Please provide a valid URL"],
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    socialMedia: {
      facebook: {
        type: String,
        validate: [validator.isURL, "Please provide a valid URL"],
      },
      twitter: {
        type: String,
        validate: [validator.isURL, "Please provide a valid URL"],
      },
      linkedin: {
        type: String,
        validate: [validator.isURL, "Please provide a valid URL"],
      },
      instagram: {
        type: String,
        validate: [validator.isURL, "Please provide a valid URL"],
      },
      tiktok: {
        type: String,
        validate: [validator.isURL, "Please provide a valid URL"],
      },
    },
    logo: {
      type: String,
      validate: [validator.isURL, "Please provide a valid URL"],
    },
    companyType: {
      type: String,
      required: [true, "Company type is required"],
      enum: {
        values: ["drinkingWaterOnly", "TankerOnly", "drinkingWaterAndTanker"],
        message:
          "Company type is either: drinkingWaterOnly, TankerOnly, or drinkingWaterAndTanker",
      },
    },
    address: {
      district: {
        type: String,
        required: [true, "District is required"],
        trim: true,
      },
      municipality: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      tole: {
        type: String,
        trim: true,
      },
      nearFamousPlace: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
      },
      province: {
        type: String,
        required: [true, "Province is required"],
        trim: true,
      },
      zip: {
        type: String,
        required: [true, "ZIP code is required"],
        trim: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        validate: {
          validator: function (v: number[]) {
            return (
              v.length === 2 &&
              v[0] >= -180 &&
              v[0] <= 180 &&
              v[1] >= -90 &&
              v[1] <= 90
            );
          },
          message:
            "Coordinates must be [longitude, latitude] with valid values",
        },
      },
    },
    establishedDate: {
      type: Date,
      required: [true, "Established date is required"],
      validate: {
        validator: function (v: Date) {
          return v <= new Date();
        },
        message: "Established date cannot be in the future",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    branches: [
      {
        type: Schema.Types.ObjectId,
        ref: "Branch",
      },
    ],
    StaffMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Staff",
      },
    ],
    vehicles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Vehicle",
      },
    ],
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    companyDocuments: {
      registrationNumber: {
        type: String,
        trim: true,
      },
      registrationCertificate: {
        type: String,
        validate: [validator.isURL, "Please provide a valid URL"],
      },
      PANNumber: {
        type: String,
        trim: true,
      },
      VATNumber: {
        type: String,
        trim: true,
      },
      VATCertificate: [
        {
          type: String,
          validate: [validator.isURL, "Please provide a valid URL"],
        },
      ],
      PANDocument: [
        {
          type: String,
          validate: [validator.isURL, "Please provide a valid URL"],
        },
      ],
      citizenshipNumber: {
        type: String,
        trim: true,
      },
      citizenshipDocument: [
        {
          type: String,
          validate: [validator.isURL, "Please provide a valid URL"],
        },
      ],
      otherDocuments: [
        {
          type: String,
          validate: [validator.isURL, "Please provide a valid URL"],
        },
      ],
    },
    bankingInfo: {
      accountNumber: {
        type: String,
        trim: true,
      },
      bankName: {
        type: String,
        trim: true,
      },
      branch: {
        type: String,
        trim: true,
      },
      QRCode: {
        type: String,
        trim: true,
      },
    },
    digitalWalletInfo: {
      eSewaId: {
        type: String,
        trim: true,
      },
      eSewaQR: {
        type: String,
        validate: [validator.isURL, "Please provide a valid URL"],
      },
      khaltiId: {
        type: String,
        trim: true,
      },
      khaltiQR: {
        type: String,
        validate: [validator.isURL, "Please provide a valid URL"],
      },
    },
    totalEmployees: {
      type: Number,
      min: [0, "Total employees cannot be negative"],
    },
    revenue: {
      type: Number,
      min: [0, "Revenue cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
companySchema.index({ Companyemail: 1 });
companySchema.index({ owner: 1 });
companySchema.index({ "address.coordinates": "2dsphere" });

companySchema.virtual("formattedAddress").get(function (this: ICompany) {
  return `${this.address.tole}, ${this.address.city}, ${this.address.district}, ${this.address.province}, ${this.address.country}`;
});

const Company = mongoose.model<ICompany>("Company", companySchema);
export default Company;
