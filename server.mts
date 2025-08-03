import app from './src/app.js'; // .js required because of ES Module
import connectDB from './src/config/db.js';
import { config } from './src/config/config.js';

const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB

    const port = config.port || 3000;
    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
