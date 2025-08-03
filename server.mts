import app from './src/app.js'; // Add `.js` even though it's .ts

const startServer = () => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};

startServer();
