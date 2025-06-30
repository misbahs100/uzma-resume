
import clientPromise from './db/mongodb';
import { ObjectId } from 'mongodb';

// dashboard queries
export async function getDashboardStats() {
  const client = await clientPromise;
  const db = client.db("uzma");

  const [vehicleCount, userCount, totalBookings, pendingBookings, totalParts, totalRepairs] = await Promise.all([
    db.collection("vehicles").countDocuments(),
    db.collection("users").countDocuments(),
    db.collection("bookings").countDocuments(),
    db.collection("bookings").countDocuments({ delivery_costs_data: { $exists: false } }),
    db.collection("parts").countDocuments(),
    db.collection("repair_memos").countDocuments(),
  ]);

  return {
    vehicles: vehicleCount,
    users: userCount,
    bookings: totalBookings,
    pending: pendingBookings,
    parts: totalParts,
    repairs: totalRepairs,
    // collected: totalCollected[0]?.total || 0,
  };
}

export async function getMonthlyBookingsData() {
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date;
  }).reverse();

  const client = await clientPromise;
  const db = client.db("uzma");

  const result = await Promise.all(
    months.map(async (monthDate) => {
      const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);

      const count = await db.collection("bookings").countDocuments({
        created_at: { $gte: start, $lte: end },
      });

      return {
        name: start.toLocaleString('default', { month: 'short' }),
        bookings: count,
      };
    })
  );

  return result;
}

export async function getInventoryChartData() {
  const client = await clientPromise;
  const db = client.db("uzma");
  const partsCollection = db.collection('parts');

  const parts = await partsCollection.find({}).toArray();

  const summary = {
    totalStock: 0,
    oldStock: 0,
    newStock: 0,
    uniqueItems: new Set<string>(),
  };

  const itemWiseStock: Record<string, { old: number; new: number }> = {};

  parts.forEach((part) => {
    const quantity = part.quantity || 0;
    const type = part.type || 'Unknown';
    const condition = part.condition || 'unknown';

    summary.totalStock += quantity;
    summary.uniqueItems.add(type);

    if (!itemWiseStock[type]) {
      itemWiseStock[type] = { old: 0, new: 0 };
    }

    if (condition === 'old') {
      summary.oldStock += quantity;
      itemWiseStock[type].old += quantity;
    } else if (condition === 'new') {
      summary.newStock += quantity;
      itemWiseStock[type].new += quantity;
    }
  });

  // Format data for charts
  const pieChartData = [
    { name: 'Old Stock', value: summary.oldStock },
    { name: 'New Stock', value: summary.newStock },
  ];

  const barChartData = Object.entries(itemWiseStock).map(
    ([name, { old, new: newStock }]) => ({
      name,
      old,
      new: newStock,
    })
  );

  return {
    totalItems: summary.uniqueItems.size,
    totalStock: summary.totalStock,
    pieChartData,
    barChartData,
  };
}

export async function getTopVehiclesData() {
  const client = await clientPromise;
  const db = client.db("uzma");
  const bookings = db.collection('bookings');

  // Calculate last 30 days manually
  const today = new Date();
  const last30Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30, 0, 0, 0, 0);

  const pipeline = [
    { $match: { created_at: { $gte: last30Days } } },
    { $group: { _id: '$vehicle', totalBookings: { $sum: 1 } } },
    { $sort: { totalBookings: -1 } },
    { $limit: 5 } // top 5 vehicles
  ];

  const result = await bookings.aggregate(pipeline).toArray();

  return result.map((item) => ({
    vehicle: item._id,
    totalBookings: item.totalBookings
  }));
}

export async function getMonthlyEarningsCosts() {
  const client = await clientPromise;
  const db = client.db("uzma");
  const bookings = db.collection('bookings');

  // Calculate six months ago manually
  const today = new Date();
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

  const allBookings = await bookings.find({ created_at: { $gte: sixMonthsAgo } }).toArray();

  const monthlyData: Record<string, { month: string; earning: number; cost: number }> = {};

  for (const booking of allBookings) {
    const createdDate = new Date(booking.created_at);
    const month = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
    let earning = 0;
    let cost = 0;

    // Earnings from deliveries
    if (booking.deliveries) {
      for (const delivery of booking.deliveries) {
        for (const challan of delivery.challans || []) {
          earning += challan.quantity * challan.unit_price;
        }
      }
    }

    // Costs from delivery_costs_data
    if (booking.delivery_costs_data) {
      for (const item of booking.delivery_costs_data) {
        cost += item.cost;
      }
    }

    if (!monthlyData[month]) {
      monthlyData[month] = { month, earning: 0, cost: 0 };
    }
    monthlyData[month].earning += earning;
    monthlyData[month].cost += cost;
  }

  const sorted = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  return sorted;
}

export async function getMonthlyRepairs() {
  const client = await clientPromise;
  const db = client.db("uzma");
  const repairCollection = db.collection('repair_memos');

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // 12 months ago

  const pipeline = [
    {
      $match: {
        date: { $gte: startDate.toISOString().split('T')[0] },
      },
    },
    {
      $group: {
        _id: {
          $substr: ['$date', 0, 7], // 'YYYY-MM'
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  const results = await repairCollection.aggregate(pipeline).toArray();

  const monthMap = new Map(results.map((r) => [r._id, r.count]));

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return {
      month: `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`,
      repairs: monthMap.get(key) || 0,
    };
  });

  return months;
}

// other queries

const ITEMS_PER_PAGE = 20;

export async function fetchUsersPages(query: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("users");

    const count = await collection.countDocuments({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { contact: { $regex: query, $options: "i" } },
        { user_role: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of users.");
  }
}

export async function fetchFilteredUsers(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("users");

    const users = await collection
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { contact: { $regex: query, $options: "i" } },
          { user_role: { $regex: query, $options: "i" } },
          { address: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ name: 1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    return users.map(user => ({
      name: user.name,
      user_role: user.user_role,
      email: user.email,
      contact: user.contact,
      address: user.address,
      image_url: user.image_url,
      id: user._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch users.");
  }
}

export async function fetchUserById(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("users");


    //
    const fetched_user = await collection.findOne({ _id: new ObjectId(id) });

    if (!fetched_user) {
      throw new Error("User not found.");
    }

    const user = {
      name: fetched_user.name,
      user_role: fetched_user.user_role,
      email: fetched_user.email,
      contact: fetched_user.contact,
      address: fetched_user.address,
      image_url: fetched_user.image_url,
      id: fetched_user._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    };

    return user;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}



export async function fetchOfficesPages(query: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("offices");

    const count = await collection.countDocuments({
      $or: [
        { office_name: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { contact: { $regex: query, $options: "i" } },
        { manager: { $regex: query, $options: "i" } },
        { code: { $regex: query, $options: "i" } },
        { bin: { $regex: query, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of offices.");
  }
}

export async function fetchOffices() {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("offices");

    const offices = await collection.find({}).toArray();

    // Convert `_id` to string
    return offices.map(office => ({
      office_name: office.office_name,
      address: office.address,
      contact: office.contact,
      manager: office.manager,
      bin: office.bin,
      id: office._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch offices.");
  }
}

export async function fetchFilteredOffices(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("offices");

    const offices = await collection
      .find({
        $or: [
          { office_name: { $regex: query, $options: "i" } },
          { address: { $regex: query, $options: "i" } },
          { contact: { $regex: query, $options: "i" } },
          { manager: { $regex: query, $options: "i" } },
          { code: { $regex: query, $options: "i" } },
          { bin: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ office_name: 1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    return offices.map(office => ({
      office_name: office.office_name,
      address: office.address,
      contact: office.contact,
      manager: office.manager,
      bin: office.bin,
      id: office._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch offices.");
  }
}

export async function fetchOfficeById(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("offices");

    const fetched_office = await collection.findOne({ _id: new ObjectId(id) });

    if (!fetched_office) {
      throw new Error("Office not found.");
    }

    const office = {
      office_name: fetched_office.office_name,
      address: fetched_office.address,
      contact: fetched_office.contact,
      manager: fetched_office.manager,
      bin: fetched_office.bin,
      code: fetched_office.code,
      id: fetched_office._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    };

    return office;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch office.");
  }
}

export async function fetchBookingsPages(query: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("bookings");

    const count = await collection.countDocuments({
      $or: [
        { customer: { $regex: query, $options: "i" } },
        { vehicle: { $regex: query, $options: "i" } },
        { driver: { $regex: query, $options: "i" } },
        { pickup_address: { $regex: query, $options: "i" } },
        { dropoff_address: { $regex: query, $options: "i" } },
        { payment_status: { $regex: query, $options: "i" } },
        { booking_status: { $regex: query, $options: "i" } },
        { booking_type: { $regex: query, $options: "i" } },
        { note: { $regex: query, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of bookings.");
  }
}

export async function fetchFilteredBookings(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("bookings");

    const bookings = await collection
      .find({
        $or: [
          // { customer: { $regex: query, $options: "i" } },
          { vehicle: { $regex: query, $options: "i" } },
          { driver: { $regex: query, $options: "i" } },
          { pickup_address: { $regex: query, $options: "i" } },
          // { dropoff_address: { $regex: query, $options: "i" } },
          { booking_type: { $regex: query, $options: "i" } },
          { note: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ created_at: -1 }) // newest issue first
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    return bookings.map(booking => ({
      id: booking._id.toString(), // ObjectId to string
      vehicle: booking.vehicle,
      driver: booking.driver,
      pickup_address: booking.pickup_address,
      pickup_dt: booking.pickup_dt,
      dropoff_dt: booking.dropoff_dt,
      return_pickup_dt: booking.return_pickup_dt,
      return_dropoff_dt: booking.return_dropoff_dt,
      booking_type: booking.booking_type,
      note: booking.note,
      credit_amount: booking.credit_amount,
      deliveries: booking.deliveries,
      delivery_costs_data: booking.delivery_costs_data,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      updated_by: booking.updated_by,
      _id: undefined, // optional
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch bookings.");
  }
}

export async function fetchBookingById(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("bookings");

    const fetched_booking = await collection.findOne({ _id: new ObjectId(id) });

    if (!fetched_booking) {
      throw new Error("Booking not found.");
    }

    const booking = {
      customer: fetched_booking.customer,
      vehicle: fetched_booking.vehicle,
      driver: fetched_booking.driver,
      pickup_address: fetched_booking.pickup_address,
      dropoff_address: fetched_booking.dropoff_address,
      pickup_dt: fetched_booking.pickup_dt,
      dropoff_dt: fetched_booking.dropoff_dt,
      passenger_num: fetched_booking.passenger_num,
      payment_status: fetched_booking.payment_status,
      booking_status: fetched_booking.booking_status,
      booking_type: fetched_booking.booking_type,
      note: fetched_booking.note,
      id: fetched_booking._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    };

    return booking;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch booking.");
  }
}

export async function fetchFilteredInventories(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("parts");

    const inventories = await collection
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { type: { $regex: query, $options: "i" } },
          { vehicle: { $regex: query, $options: "i" } },
          { condition: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ name: 1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    return inventories.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      type: item.type,
      vehicle: item.vehicle,
      condition: item.condition,
      quantity: item.quantity,
      price: item.price,
      expire_date: item.expire_date,
      created_at: item.created_at,
      updated_at: item.updated_at,
      _id: undefined,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch inventories.");
  }
}







