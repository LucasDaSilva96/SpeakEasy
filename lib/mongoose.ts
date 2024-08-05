import mongoose from 'mongoose';

// Flag to check if the database is connected
let isConnected = false;

// Function to connect to the database
export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGO_DB_URI) {
    throw new Error('MongoDB URI is missing');
  }

  if (isConnected) {
    return console.log('🛜 using existing database connection');
  }

  try {
    await mongoose.connect(process.env.MONGO_DB_URI);

    isConnected = true;

    console.log('✅ using new database connection');
  } catch (err) {
    console.error('❌ Error connecting to database: ', err);
  }
};
