const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const axios = require("axios");
const FormData = require("form-data");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors({
  origin: ['http://localhost:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const secret = '1234';
const apiKey = '659334a9e9c96f2ffb5e4074c8fba217';

mongoose
  .connect("mongodb://localhost:27017/shop")
  .then(() => console.log("MongoDB connected")).catch(err => console.error("MongoDB connection error:", err));


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  image: String,
  gender: String,
  role: { type: String, default: "user" },
});
const User = mongoose.model("User", userSchema);

const productSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: Number,
  details: String,
});
const Product = mongoose.model("Product", productSchema);

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  username: String,
  products: [
    {
      productId: String,
      title: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalPrice: Number,
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  date: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);

// Middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
 if (!token) return res.status(401).json("no token");

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json("invalid token");
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json("not allowed");
  next();
}
app.get('/image/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'uploads', imageName);
  console.log(imagePath);
  res.sendFile(imagePath);
  //console.log(res);
});
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;
    const image = req.files?.image;
    console.log("Files received:", req.files);
    console.log("image", image);
    if (!image) return res.status(400).json("Image is required");
    if (!name || !email || !password || !gender) {
      
      return res.status(400).json("Missing required fields");
    }
    console.log("fine");
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json("Email already used");
    const url = upload(image);
    const hashed = await bcrypt.hash(password, 9);
    const user = new User({ name, email, password: hashed, gender, image: url, role: "admin" });

    await user.save();
    res.status(201).json(user);

  } catch (error) {
    console.error("Register error:", error?.response?.data || error.message);
    res.status(500).json(error?.response?.data || "Registration failed");
  }
});
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json("user not found");

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(403).json("wrong password");

  jwt.sign({ id: user._id, role: user.role, name: user.name }, secret, (err, token) => {
    if (err) return res.status(500).json("token error");
    res.status(200).json({ token, user});
  });
});
app.get("/products", async (req, res) => {
  const search = req.query.search || "";
  const data = await Product.find({ title: { $regex: search, $options: "i" } });
  res.json(data);
});
function upload(image)
{
  const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    const filePath = path.join(uploadsDir, image.name);
    image.mv(filePath, (err) => {
      if (err) {
        console.error("Error saving file:", err);
        return res.status(500).json("Failed to save image");
      }
    });
    return `/uploads/${image.name}`;
  }
app.post("/products", async (req, res) => {
  try {
    const image = req.files?.image;
    if (!image) return res.status(400).json("image is required");
    upload(image);
    const imageUrl = `/uploads/${image.name}`;
    const product = new Product({ ...req.body, image: imageUrl });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Add product error:", error?.response?.data || error.message);
    res.status(500).json(error?.response?.data || error.message || "Product creation failed");
  }
});

app.put("/products/:id", auth, isAdmin, async (req, res) => {
  await Product.updateOne({ _id: req.params.id }, { $set: req.body });
  res.send("updated");
});

app.delete("/products/:id", auth, isAdmin, async (req, res) => {
  await Product.deleteOne({ _id: req.params.id });
  res.send("deleted");
});

app.post("/orders", auth, async (req, res) => {
  const { products } = req.body;
  console.log("lose");
  const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const order = new Order({
    userId: req.user.id,
    username: req.user.name,
    products,
    totalPrice,
  });

  await order.save();
  res.status(201).json(order);
});

app.get("/my-orders", auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});

app.get("/orders", auth, isAdmin, async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.put("/orders/:id", auth, isAdmin, async (req, res) => {
  await Order.updateOne({ _id: req.params.id }, { status: req.body.status });
  res.send("order updated");
});

app.delete("/orders/:id", auth, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
  if (!order || order.status !== "pending") return res.status(403).json("not allowed");

  await Order.deleteOne({ _id: req.params.id });
  res.send("order canceled");
});

app.listen(3000, () => console.log("server is running on port 3000"));
