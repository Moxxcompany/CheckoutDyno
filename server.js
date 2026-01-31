// Custom server with forced logging for Railway
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

// Force stdout to be unbuffered
if (process.stdout._handle) {
  process.stdout._handle.setBlocking(true);
}
if (process.stderr._handle) {
  process.stderr._handle.setBlocking(true);
}

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

// Immediate log on file load
console.log(`[${new Date().toISOString()}] ✅ Server script loaded`);
console.log(`[${new Date().toISOString()}] ✅ Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`[${new Date().toISOString()}] ✅ Port: ${port}`);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  console.log(`[${new Date().toISOString()}] ✅ Next.js app prepared`);
  
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      
      // Log each request
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error(`[${new Date().toISOString()}] ❌ Error:`, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
  .once('error', (err) => {
    console.error(`[${new Date().toISOString()}] ❌ Server error:`, err);
    process.exit(1);
  })
  .listen(port, hostname, () => {
    console.log(`[${new Date().toISOString()}] ✅ Server running at http://${hostname}:${port}`);
    console.log(`[${new Date().toISOString()}] ✅ Ready to accept connections`);
  });
}).catch((err) => {
  console.error(`[${new Date().toISOString()}] ❌ Failed to prepare Next.js:`, err);
  process.exit(1);
});

// Log on process signals
process.on('SIGTERM', () => {
  console.log(`[${new Date().toISOString()}] 🛑 SIGTERM received, shutting down...`);
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log(`[${new Date().toISOString()}] 🛑 SIGINT received, shutting down...`);
  process.exit(0);
});
