"use server";

import { auth, getUser, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import clientPromise from "./db/mongodb";
import { ObjectId } from "mongodb";


// types and schemas

const UserFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: "Please write a name.",
  }),
  email: z.string({
    invalid_type_error: "Please write an email.",
  }),
  password: z
    .string()
    .refine(
      (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value ?? ""
        ),
      "Password should have 1 small and 1 capital letter, 1 number, 1 special character without dot(.). It has to be minimum of length 8."
    ),
  contact: z.string({
    invalid_type_error: "Please write a phone number.",
  }),
  user_role: z.string({
    invalid_type_error: "Please select a role for the user.",
  }),
  address: z.string({
    invalid_type_error: "Please write an address.",
  }),
  date: z.string(),
});

export type UserState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    contact?: string[];
    user_role?: string[];
    address?: string[];
  };
  message?: string | null;
};

const OfficeFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: "Please write office name.",
  }).min(1, "Please write office name."),
  address: z.string({
    invalid_type_error: "Please write office address.",
  }).min(1, "Please write office/branch address/location."),
  manager: z.string({
    invalid_type_error: "Please write manager name.",
  }).min(1, "Please write manager name."),
  contact: z.string({
    invalid_type_error: "Please write contact info.",
  }).min(1, "Please write contact info."),
  bin: z.string({
    invalid_type_error: "Please provide the business identification number."
  }).min(1, "Please provide the business identification number."),
  date: z.string(),
});

export type OfficeState = {
  errors?: {
    name?: string[];
    address?: string[];
    manager?: string[];
    contact?: string[];
    bin?: string[];
  };
  message?: string | null;
  values?: {
    name?: string;
    address?: string;
    manager?: string;
    contact?: string;
    bin?: string;
  }
};

const SingleChallanDataSchema = z.object({
  item_detail: z.string({
    invalid_type_error: "Please write the item detail.",
  }),
  delivery_unit: z.string({
    invalid_type_error: "Please write the delivery unit.",
  }),
  quantity: z.coerce
    .number()
    .gt(0, { message: "Quantity must be at least 1." }),
  unit_price: z.coerce
    .number()
    .gt(0, { message: "Unit price must be at least 1." }),
  supplementary_duty_rate: z.coerce
    .number()
    .gte(0, { message: "Supplementary Duty Rate must be at least 1." }),
  value_added_tax_rate: z.coerce
    .number()
    .gt(0, { message: "Value Added Tax must be at least 1." }),
});

const SingleDeliveryCostDataSchema = z.object({
  cost_reason: z.string({
    invalid_type_error: "Please write the reason of cost.",
  }),
  remarks: z.string({
    invalid_type_error: "Please write the remarks.",
  }).optional(),
  cost: z.coerce
    .number()
    .gte(0, { message: "Cost must be at least 0." }),
});

const SingleDeliveryDataSchema = z.object({
  challans: z.array(SingleChallanDataSchema),
  customer: z.string({
    invalid_type_error: "Please provide customer name.",
  }).min(1, "Please provide customer name."),
  customer_bin: z.string({
    invalid_type_error: "Please provide customer BIN.",
  }).min(1, "Please provide customer BIN."),
  customer_address: z.string({
    invalid_type_error: "Please provide customer address.",
  }).optional(),
  id: z.string().optional()
});

const BookingFormSchema = z.object({
  id: z.string(),
  vehicle: z.string({
    invalid_type_error: "Please provide vehicle info.",
  }).min(1, "Please provide vehicle info."),
  driver: z.string({
    invalid_type_error: "Please provide driver info.",
  }).min(1, "Please provide driver info."),
  pickup_address: z.string({
    invalid_type_error: "Please provide pickup address.",
  }).min(1, "Please provide pickup address."),
  pickup_dt: z.string({
    invalid_type_error: "Please provide pickup date & time.",
  }).min(1, "Please provide pickup date & time."),
  dropoff_dt: z.string({
    invalid_type_error: "Please provide dropoff date & time.",
  }).optional(),
  return_pickup_dt: z.string().optional(),
  return_dropoff_dt: z.string().optional(),
  booking_type: z.enum(["oneway", "return"], { invalid_type_error: "Please provide booking type." }).optional(),
  note: z.string().optional(),
  credit_amount: z.coerce
    .number()
    .gte(0, { message: "Credit amount must be at least 0." }),
  delivery_costs_data: z.array(SingleDeliveryCostDataSchema).optional(),
  deliveries: z.array(SingleDeliveryDataSchema).optional(),
});

export type BookingState = {
  errors?: {

    vehicle?: string[];
    driver?: string[];
    pickup_address?: string[];

    pickup_dt?: string[];
    dropoff_dt?: string[];
    return_pickup_dt?: string[];
    return_dropoff_dt?: string[];

    booking_type?: string[];
    note?: string[];
    credit_amount?: string[];
    // challan_data?: { item_detail?: string[]; delivery_unit?: string[]; quantity?: string[]; unit_price?: string[]; supplementary_duty_rate?: string[]; value_added_tax_rate?: string[]; }[];
  };
  message?: string | null;
  voucherData?: object;
  values?: {

    vehicle?: string;
    driver?: string;
    pickup_address?: string;

    pickup_dt?: string;
    dropoff_dt?: string;
    return_pickup_dt?: string;
    return_dropoff_dt?: string;

    booking_type?: string;
    note?: string;
    credit_amount?: string;
  }
};

const InventoryFormSchema = z.object({
  id: z.string(),
  name: z.string({ invalid_type_error: "Part name is required." }).min(1, "Please write a name."),
  type: z.string({ invalid_type_error: "Part type is required." }),
  vehicle: z.string({ invalid_type_error: "Vehicle info is required." }),
  condition: z.enum(["new", "old"], { invalid_type_error: "Condition is required." }),
  quantity: z.coerce.number({ invalid_type_error: "Quantity must be a number." }).gt(0, { message: "Please enter a quantity greater than 0." }),
  price: z.coerce.number({ invalid_type_error: "Price must be a number." }).gt(0, { message: "Please enter an amount greater than ৳0." }),
  expire_date: z.string().optional(), // ISO string, optional
});

export type InventoryState = {
  errors?: {
    name?: string[];
    type?: string[];
    vehicle?: string[];
    condition?: string[];
    quantity?: string[];
    price?: string[];
    expire_date?: string[];
  };
  message?: string | null;
  values?: {
    name?: string;
    type?: string;
    vehicle?: string;
    condition?: string;
    quantity?: string;
    price?: string;
    expire_date?: string;
  }
};



// functions

const CreateUser = UserFormSchema.omit({ id: true, date: true });
export async function createUser(prevState: UserState, formData: FormData) {
  const validatedFields = CreateUser.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    contact: formData.get("contact"),
    user_role: formData.get("user_role"),
    address: formData.get("address"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User.",
    };
  }

  const { name, email, password, contact, user_role, address } =
    validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const image_url = "/customers/evil-rabbit.png";
  const date = new Date().toISOString().split("T")[0];

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("users");

    await collection.insertOne({
      name,
      email,
      password: hashedPassword,
      contact,
      user_role,
      address,
      image_url,
      created_at: date,
    });

    revalidatePath("/dashboard/users");
    return { message: "User created successfully." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Create User." };
  }
}

export async function deleteUser(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("users");

    await collection.deleteOne({ _id: new ObjectId(id) });

    revalidatePath("/dashboard/users");
    return { message: "Deleted User." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Delete User." };
  }
}


const CreateOffice = OfficeFormSchema.omit({ id: true, date: true });
export async function createOffice(prevState: OfficeState, formData: FormData) {
  const validatedFields = CreateOffice.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    manager: formData.get("manager"),
    contact: formData.get("contact"),
    bin: formData.get("bin"),
  });

  if (!validatedFields.success) {
    console.log("error:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Office.",
      values: {
        name: formData.get("name")?.toString() || "",
        address: formData.get("address")?.toString() || "",
        manager: formData.get("manager")?.toString() || "",
        contact: formData.get("contact")?.toString() || "",
        bin: formData.get("bin")?.toString() || "",
      }
    };
  }

  const { name, address, manager, contact, bin } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("offices");

    await collection.insertOne({
      office_name: name,
      address,
      manager,
      contact,
      bin,
      created_at: new Date(),
    });

    revalidatePath("/dashboard/offices");
    return { message: "Office created successfully." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Create Office." };
  }
}

const UpdateOffice = OfficeFormSchema.omit({ id: true, date: true });
export async function updateOffice(
  id: string,
  prevState: OfficeState,
  formData: FormData
) {
  const validatedFields = UpdateOffice.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    manager: formData.get("manager"),
    contact: formData.get("contact"),
    bin: formData.get("bin"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Office.",
      values: {
        name: formData.get("name")?.toString() || "",
        address: formData.get("address")?.toString() || "",
        manager: formData.get("manager")?.toString() || "",
        contact: formData.get("contact")?.toString() || "",
        bin: formData.get("bin")?.toString() || "",
      }
    };
  }

  const { name, address, manager, contact, bin } = validatedFields.data;
  console.log(id, name, address, manager, contact, bin)

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("offices");

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          office_name: name,
          address,
          manager,
          contact,
          bin,
        },
      }
    );

    revalidatePath("/dashboard/offices");
    return { message: "Office edited successfully." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Update Office." };
  }
}

export async function deleteOffice(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("offices");

    await collection.deleteOne({ _id: new ObjectId(id) });

    revalidatePath("/dashboard/offices");
    return { message: "Deleted office." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Delete Office." };
  }
}


const CreateBooking = BookingFormSchema.omit({ id: true });
export async function createBooking(prevState: BookingState, formData: FormData) {
  const validatedFields = CreateBooking.safeParse({
    vehicle: formData.get("vehicle"),
    driver: formData.get("driver"),
    pickup_address: formData.get("pickup_address"),
    pickup_dt: formData.get("pickup_dt"),
    dropoff_dt: formData.get("dropoff_dt"),
    return_pickup_dt: formData.get("return_pickup_dt") || undefined,
    return_dropoff_dt: formData.get("return_dropoff_dt") || undefined,
    booking_type: formData.get("booking_type"),
    note: formData.get("note") || undefined,
    credit_amount: formData.get("credit_amount"),
    deliveries: JSON.parse(formData.get("deliveries") as string),
  });

  if (!validatedFields.success) {
    console.log("Validation error:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Booking.",
      values: {
        vehicle: formData.get("vehicle")?.toString() || "",
        driver: formData.get("driver")?.toString() || "",
        pickup_address: formData.get("pickup_address")?.toString() || "",
        pickup_dt: formData.get("pickup_dt")?.toString() || "",
        dropoff_dt: formData.get("dropoff_dt")?.toString() || "",
        return_pickup_dt: formData.get("return_pickup_dt")?.toString() || undefined,
        return_dropoff_dt: formData.get("return_dropoff_dt")?.toString() || undefined,
        booking_type: formData.get("booking_type")?.toString() || "",
        note: formData.get("note")?.toString() || undefined,
        credit_amount: formData.get("credit_amount")?.toString(),
        deliveries: JSON.parse(formData.get("deliveries") as string),
      }
    };
  }

  const {
    vehicle,
    driver,
    pickup_address,
    pickup_dt,
    dropoff_dt,
    return_pickup_dt,
    return_dropoff_dt,
    booking_type,
    note,
    credit_amount,
    deliveries,
  } = validatedFields.data;

  try {
    const session = await auth();
    let userInfo = null;
    if (session?.user?.email) {
      userInfo = await getUser(session.user.email);
    }
    const created_by = userInfo?.name || "system";

    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("bookings");

    const ddd = await collection.insertOne({
      vehicle,
      driver,
      pickup_address,
      pickup_dt: new Date(pickup_dt),
      dropoff_dt: dropoff_dt ? new Date(dropoff_dt) : null,
      return_pickup_dt: return_pickup_dt ? new Date(return_pickup_dt) : null,
      return_dropoff_dt: return_dropoff_dt ? new Date(return_dropoff_dt) : null,
      booking_type,
      note: note || "",
      credit_amount,
      deliveries,
      created_at: new Date(),
      created_by: created_by,
      updated_at: null,
      updated_by: null,
    });

    const bookingId = ddd.insertedId.toString();

    let voucherData = {
      bookingNumber: bookingId,
      vehicle,
      driver,
      pickup_address,
      pickup_dt: new Date(pickup_dt),
      dropoff_dt: dropoff_dt ? new Date(dropoff_dt) : null,
      return_pickup_dt: return_pickup_dt ? new Date(return_pickup_dt) : null,
      return_dropoff_dt: return_dropoff_dt ? new Date(return_dropoff_dt) : null,
      booking_type,
      note: note || "",
      credit_amount,
      deliveries,
      created_at: new Date(),
    };
    return { message: "Booking created successfully.", voucherData };
    // return { message: "Booking created successfully."};
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Create Booking." };
  }
}

const UpdateBooking = BookingFormSchema.omit({ id: true });
export async function updateBooking(
  id: string,
  prevState: BookingState,
  formData: FormData
) {
  const validatedFields = UpdateBooking.safeParse({
    vehicle: formData.get("vehicle"),
    driver: formData.get("driver"),
    pickup_address: formData.get("pickup_address"),
    pickup_dt: formData.get("pickup_dt"),
    dropoff_dt: formData.get("dropoff_dt"),
    return_pickup_dt: formData.get("return_pickup_dt") || undefined,
    return_dropoff_dt: formData.get("return_dropoff_dt") || undefined,
    booking_type: formData.get("booking_type"),
    note: formData.get("note") || undefined,
    credit_amount: formData.get("credit_amount")?.toString(),
    deliveries: JSON.parse(formData.get("deliveries") as string),
    delivery_costs_data: JSON.parse(formData.get("delivery_costs_data") as string),
  });

  if (!validatedFields.success) {
    console.log("Validation error:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Booking.",
      values: {
        vehicle: formData.get("vehicle")?.toString() || "",
        driver: formData.get("driver")?.toString() || "",
        pickup_address: formData.get("pickup_address")?.toString() || "",
        pickup_dt: formData.get("pickup_dt")?.toString() || "",
        dropoff_dt: formData.get("dropoff_dt")?.toString() || "",
        return_pickup_dt: formData.get("return_pickup_dt")?.toString() || undefined,
        return_dropoff_dt: formData.get("return_dropoff_dt")?.toString() || undefined,
        booking_type: formData.get("booking_type")?.toString() || "",
        note: formData.get("note")?.toString() || undefined,
        credit_amount: formData.get("credit_amount")?.toString(),
        deliveries: JSON.parse(formData.get("deliveries") as string),
        delivery_costs_data: JSON.parse(formData.get("delivery_costs_data") as string),
      }
    };
  }

  const {
    vehicle,
    driver,
    pickup_address,
    pickup_dt,
    dropoff_dt,
    return_pickup_dt,
    return_dropoff_dt,
    booking_type,
    note,
    credit_amount,
    deliveries,
    delivery_costs_data,
  } = validatedFields.data;

  try {
    const session = await auth();
    let userInfo = null;
    if (session?.user?.email) {
      userInfo = await getUser(session.user.email);
    }
    const updated_by = userInfo?.name || "system";

    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("bookings");

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {

          vehicle,
          driver,
          pickup_address,
          pickup_dt,
          dropoff_dt,
          return_pickup_dt,
          return_dropoff_dt,
          booking_type,
          note,
          credit_amount,
          deliveries,
          delivery_costs_data,
          updated_at: new Date(),
          updated_by: updated_by,
        },
      }
    );

    revalidatePath("/dashboard/bookings");
    return { message: "Booking edited successfully." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Update Booking." };
  }
}

const CreateInventory = InventoryFormSchema.omit({ id: true });
export async function createInventory(prevState: InventoryState, formData: FormData) {
  const validatedFields = CreateInventory.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    vehicle: formData.get("vehicle"),
    condition: formData.get("condition"),
    quantity: formData.get("quantity"),
    price: formData.get("price"),
    expire_date: formData.get("expire_date") || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to add part.",
      values: {
        name: formData.get("name")?.toString() || "",
        type: formData.get("type")?.toString() || "",
        vehicle: formData.get("vehicle")?.toString() || "",
        condition: formData.get("condition")?.toString() || "",
        quantity: formData.get("quantity")?.toString() || "",
        price: formData.get("price")?.toString() || "",
        expire_date: formData.get("expire_date")?.toString() || "",
      },
    };
  }

  const { name, type, vehicle, condition, quantity, price, expire_date } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db("uzma");

    // Check for duplicate part
    const duplicate = await db.collection("parts").findOne({
      name, type, condition,
    });

    if (duplicate) {
      return {
        errors: {
          name: ["A part with the same name, type, and condition already exists."],
          type: ["A part with the same name, type, and condition already exists."],
          condition: ["A part with the same name, type, and condition already exists."],
        },
        message: "Duplicate part. Failed to add.",
        values: {
          name: formData.get("name")?.toString() || "",
          type: formData.get("type")?.toString() || "",
          vehicle: formData.get("vehicle")?.toString() || "",
          condition: formData.get("condition")?.toString() || "",
          quantity: formData.get("quantity")?.toString() || "",
          price: formData.get("price")?.toString() || "",
          expire_date: formData.get("expire_date")?.toString() || "",
        },
      };
    }

    const partData = {
      name,
      type,
      vehicle,
      condition,
      quantity,
      price,
      expire_date: expire_date ? new Date(expire_date) : null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await db.collection("parts").insertOne(partData);

    revalidatePath("/dashboard/inventory");
    return { message: "Part added to inventory successfully." };
  } catch (error) {
    console.error("Inventory DB Error:", error);
    return { message: "Database error: Failed to add part." };
  }
}

const UpdateInventory = InventoryFormSchema.omit({ id: true });
export async function updateInventory(
  id: string,
  prevState: InventoryState,
  formData: FormData
) {
  const validatedFields = UpdateInventory.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    vehicle: formData.get("vehicle"),
    condition: formData.get("condition"),
    quantity: formData.get("quantity"),
    price: formData.get("price"),
    expire_date: formData.get("expire_date") || undefined,
  });

  if (!validatedFields.success) {
    console.log("Validation error:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Inventory.",
      values: {
        name: formData.get("name")?.toString() || "",
        type: formData.get("type")?.toString() || "",
        vehicle: formData.get("vehicle")?.toString() || "",
        condition: formData.get("condition")?.toString() || "",
        quantity: formData.get("quantity")?.toString() || "",
        price: formData.get("price")?.toString() || "",
        expire_date: formData.get("expire_date")?.toString() || "",
      },
    };
  }

  const { name, type, vehicle, condition, quantity, price, expire_date } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("parts");

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          type,
          vehicle,
          condition,
          quantity,
          price,
          expire_date: expire_date ? new Date(expire_date) : null,
          updated_at: new Date(),
        },
      }
    );

    revalidatePath("/dashboard/inventory");
    return { message: "Inventory item updated successfully." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Update Inventory." };
  }
}




// authentication
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
