const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
require("dotenv").config();
const Port = 3000;
const authRoutes = require("./Router/Auth");
const userRoutes = require("./Router/User");

const {
  addUser,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("./Controllers/UserController");

const connectDB = require("./Config/db");

connectDB();

app.use(express.json());
app.use(fileUpload());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/addUser", addUser);
app.get("/:id", getUserById);
app.put("/:id", updateUserById);
app.delete("/:id", deleteUserById);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(Port, () => console.log("server started at", Port));
