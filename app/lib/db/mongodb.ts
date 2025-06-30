import { MongoClient } from "mongodb";

// Extend the NodeJS.Global interface to include _mongoClientPromise
declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }
}

const uri = process.env.MONGODB_URI as string;
// console.log(uri);
if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable in .env");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Use a global variable to preserve the client during hot reloads in development
  if (!(global as NodeJS.Global)._mongoClientPromise) {
    client = new MongoClient(uri);
    (global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> })._mongoClientPromise = client.connect();
  }
  clientPromise = (global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> })._mongoClientPromise!;
} else {
  // In production, create a new client for each request
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
