import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI || MONGODB_URI.includes('<username>')) {
  console.warn(
    '⚠️  MONGODB_URI is not configured. Set it in .env.local to enable database features.'
  );
}

// Cached connection to avoid creating a new connection on every hot-reload
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI || MONGODB_URI.includes('<username>')) {
    throw new Error('MONGODB_URI is not configured. Please update .env.local with your MongoDB Atlas connection string.');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
