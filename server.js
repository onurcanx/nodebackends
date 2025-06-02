const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// CORS ayarları
const corsOptions = {
  origin: ['https://frontend-phi-ten-88.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Rotalar
app.use("/api/auth", require("./routes/auth"));
app.use("/api/auth/comments", require("./routes/comments"));

// Sağlık kontrolü endpoint'i
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(port, () => {
  console.log(`Node.js backend ${port} portunda çalışıyor`);
}); 