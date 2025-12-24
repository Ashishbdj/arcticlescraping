require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const scrapeBlogs = require("./ScrapBlogs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// frontend serve
app.use(express.static(path.join(__dirname, "../public")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // 🔥 YAHAN RUN KARO
    await scrapeBlogs();
  })
  .catch(console.error);

app.use("/api/articles", require("./routes"));

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
