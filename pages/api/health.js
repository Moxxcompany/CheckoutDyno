// Health check endpoint for Railway
export default function handler(req, res) {
  console.log(`[${new Date().toISOString()}] Health check pinged`);
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
