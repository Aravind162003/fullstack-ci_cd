const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || "mongodb://mongo:27017/mern";

mongoose.connect(mongoUrl)
  .then(() => console.log("MongoDB Connected:", mongoUrl))
  .catch(err => console.error("Mongo connect error:", err));

app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/api/users", async (req, res) => {
  const user = new User({ name: req.body.name });
  await user.save();
  res.json({ message: "User added" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
