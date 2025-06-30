// types are generated automatically if we use an ORM such as Prisma.

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  contact: string;
  user_role: string;
  address: string;
  image_url: string;
  created_at: string;
};

export type Revenue = {
  month: string;
  revenue: number;
  year: number;
};

export type UserTable = {
  id: string;
  name: string;
  email: string;
  contact: number;
  user_role: string;
  address: string;
  image_url: string;
};

export type BranchesTable = {
  id: string;
  branch_name: string;
  address: string;
  manager: {
    id: string;
    name: string;
    email: string;
    contact: string;
    user_role: string;
    image_url: string;
    created_at: string;
  };
};

export type OfficeForm = {
  id: string;
  office_name: string;
  address: string;
  manager: string;
  contact: string;
  bin: string;
};

export type BookingForm = {
  id: string;
  vehicle: string;
  driver: string;
  pickup_address: string;
  pickup_dt: string;
  dropoff_dt: string;
  return_pickup_dt: string;
  return_dropoff_dt: string;
  booking_type: string;
  note: string;
  credit_amount: string;
  deliveries: JSON;
  delivery_costs_data: JSON;
  created_at: string;
  updated_at: string;
  updated_by: string;
};

export type InventoryForm = {
  id: string;
  name: string;
  type: string;
  vehicle: string;
  condition: string;
  quantity: string;
  price: string;
  expire_date: string;
  created_at: string;
  updated_at: string;
};

export type DeliveryFilters = {
  startDate: string;
  endDate: string;
  vehicle?: string;
  query?: string;
};
