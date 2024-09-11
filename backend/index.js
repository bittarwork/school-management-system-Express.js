const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const bodyParser = require("body-parser")
const app = express();
const Routes = require("./routes/route.js");

const PORT = process.env.PORT || 5000;

dotenv.config();

// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json({ limit: "10mb" }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("✅ Connected to MongoDB DataBase"))
  .catch((err) => console.log("💥 NOT CONNECTED TO NETWORK : ", err));

app.use("/", Routes);

// Simple ping route to check server status
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "🏓 Pong! Server is working fine." });
});

app.listen(PORT, () => {
  console.log(`✅ Server started at port no. ${PORT}`);
});
