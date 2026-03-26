const mongoose = require('mongoose');
const app = require('./app');
const { port, mongoUri } = require('./config');

async function start() {
  await mongoose.connect(mongoUri);
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});
