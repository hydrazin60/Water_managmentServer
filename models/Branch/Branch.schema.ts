import mongoose, { Schema, Document, Types, Model } from "mongoose";
import validator from "validator";

// Type for branch types
export type BranchType = "manufacturing" | "distribution" | "warehouse";
export interface IBranch extends Document {
  branchName: string;
  branchCode: string;
  branchType: BranchType;
  manager: Types.ObjectId; 
  email: string;
  phone: string;
  address: {
    District: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates?: [number, number]; // [longitude, latitude]
  };
  Staff?: Types.ObjectId[];
  Vehicles?: Types.ObjectId[];
  Products?: Types.ObjectId[];
  productOrdersInInternalBranch?: Types.ObjectId[];
  Orders?: Types.ObjectId[];
  rawMaterials?: Types.ObjectId[];
  rawMaterialOrders?: Types.ObjectId[];
  PurchaseInvoices?: Types.ObjectId[];
  SalesInvoices?: Types.ObjectId[];
  ExpensesBills?: Types.ObjectId[];
  TodayTasks?: Types.ObjectId[];
  Deliveries?: Types.ObjectId[];
  Attendances?: Types.ObjectId[];
  Custommers?: Types.ObjectId[];
  Supliers?: Types.ObjectId[];
  operationalHours: {
    openingTime: string;
    closingTime: string;
    workingDays: string[];
  };
  capacity?: {
    storage?: number;
    productionCapacity?: number;
    throughput?: number;
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
  isActive: boolean;
  openingDate: Date;
  lastAuditDate?: Date;
  documents?: {
    license?: string;
    permit?: string;
    insurance?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface IBranchModel extends Model<IBranch> {
  isBranchCodeUnique(
    branchCode: string,
    excludeBranchId?: string
  ): Promise<boolean>;
  getBranchesByType(branchType: BranchType): Promise<IBranch[]>;
}

const branchSchema = new Schema<IBranch, IBranchModel>(
  {
    branchName: {
      type: String,
      required: [true, "Branch name is required"],
      trim: true,
      maxlength: [100, "Branch name cannot exceed 100 characters"],
    },
    branchCode: {
      type: String,
      required: [true, "Branch code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      validate: {
        validator: (v: string) => /^[A-Z0-9]{3,10}$/.test(v),
        message: "Branch code must be 3-10 alphanumeric characters",
      },
    },
    branchType: {
      type: String,
      required: [true, "Branch type is required"],
      enum: {
        values: ["manufacturing", "distribution", "warehouse"],
        message:
          "Branch type must be manufacturing, distribution, or warehouse",
      },
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: [true, "Manager reference is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: (v: string) =>
          validator.isMobilePhone(v, "any", { strictMode: false }),
        message: "Please provide a valid phone number",
      },
    },
    address: {
      District: {
        type: String,
        required: [true, "District is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
      },
      postalCode: {
        type: String,
        required: [true, "Postal code is required"],
        trim: true,
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: (v: number[]) =>
            v.length === 2 &&
            v[0] >= -180 &&
            v[0] <= 180 &&
            v[1] >= -90 &&
            v[1] <= 90,
          message:
            "Coordinates must be [longitude, latitude] with valid values",
        },
      },
    },
    Staff: [
      {
        type: Schema.Types.ObjectId,
        ref: "Staff",
      },
    ],
    Vehicles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Vehicle",
      },
    ],
    Products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    productOrdersInInternalBranch: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductOrder",
      },
    ],
    Orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    rawMaterials: [
      {
        type: Schema.Types.ObjectId,
        ref: "RawMaterial",
      },
    ],
    rawMaterialOrders: [
      {
        type: Schema.Types.ObjectId,
        ref: "RawMaterialOrder",
      },
    ],
    PurchaseInvoices: [
      {
        type: Schema.Types.ObjectId,
        ref: "PurchaseInvoice",
      },
    ],
    SalesInvoices: [
      {
        type: Schema.Types.ObjectId,
        ref: "SalesInvoice",
      },
    ],
    ExpensesBills: [
      {
        type: Schema.Types.ObjectId,
        ref: "ExpenseBill",
      },
    ],
    TodayTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    Deliveries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Delivery",
      },
    ],
    Attendances: [
      {
        type: Schema.Types.ObjectId,
        ref: "Attendance",
      },
    ],
    Custommers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Customer",
      },
    ],
    Supliers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Supplier",
      },
    ],
    operationalHours: {
      openingTime: {
        type: String,
        required: [true, "Opening time is required"],
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please use HH:MM format"],
      },
      closingTime: {
        type: String,
        required: [true, "Closing time is required"],
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please use HH:MM format"],
        validate: {
          validator: function (this: IBranch, v: string) {
            return v > this.operationalHours.openingTime;
          },
          message: "Closing time must be after opening time",
        },
      },
      workingDays: {
        type: [String],
        required: [true, "Working days are required"],
        enum: {
          values: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          message: "Invalid day of week",
        },
      },
    },
    capacity: {
      storage: {
        type: Number,
        min: [0, "Storage capacity cannot be negative"],
      },
      productionCapacity: {
        type: Number,
        min: [0, "Production capacity cannot be negative"],
        required: function (this: IBranch) {
          return this.branchType === "manufacturing";
        },
      },
      throughput: {
        type: Number,
        min: [0, "Throughput cannot be negative"],
      },
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
        trim: true,
      },
      khaltiId: {
        type: String,
        trim: true,
      },
      khaltiQR: {
        type: String,
        trim: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    openingDate: {
      type: Date,
      required: [true, "Opening date is required"],
      validate: {
        validator: (v: Date) => v <= new Date(),
        message: "Opening date cannot be in the future",
      },
    },
    lastAuditDate: {
      type: Date,
      validate: {
        validator: (v: Date) => v <= new Date(),
        message: "Audit date cannot be in the future",
      },
    },
    documents: {
      license: {
        type: String,
      },
      permit: {
        type: String,
      },
      insurance: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
branchSchema.index({ branchCode: 1 }, { unique: true });
branchSchema.index({ branchType: 1 });
branchSchema.index({ "address.coordinates": "2dsphere" });

// Virtuals
branchSchema.virtual("fullAddress").get(function (this: IBranch) {
  return `${this.address.District}, ${this.address.city}, ${this.address.state}, ${this.address.country}, ${this.address.postalCode}`;
});

// Static methods
branchSchema.statics.isBranchCodeUnique = async function (
  branchCode: string,
  excludeBranchId?: string
): Promise<boolean> {
  const branch = await this.findOne({
    branchCode,
    _id: { $ne: excludeBranchId },
  });
  return !branch;
};

branchSchema.statics.getBranchesByType = async function (
  branchType: BranchType
): Promise<IBranch[]> {
  return this.find({ branchType });
};

// Instance methods
branchSchema.methods.getFullAddress = function (): string {
  return this.fullAddress;
};

const Branch = mongoose.model<IBranch, IBranchModel>("Branch", branchSchema);
export default Branch;
