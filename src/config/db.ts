import mongoose from 'mongoose';
import { config } from './config.js';


const connectDB = async () => {
  try {
    await mongoose.connect(config.databaseURL as string, {
      // useNewUrlParser and useUnifiedTopology are no longer necessary in Mongoose 6+
    });

    console.log('✅ Connected to MongoDB');

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;
