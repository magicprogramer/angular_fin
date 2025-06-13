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
  status: { type: String, enum: ["pending", "accepted", "rejected", "canceled"], default: "pending" },
  date: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);

// Middleware
function auth(req, res, next) {
  console.log("hello");
  const token = req.headers.authorization?.split(" ")[1];
 if (!token) return res.status(401).json("no token");

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json("invalid token");
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role && req.user.role !== "admin") return res.status(403).json("not allowed");
  next();
}
app.get("/users", auth, isAdmin, async (req, res) =>{
 // console.log(res);
  const users = await User.find();
  res.send(users);
})
app.put("/users", auth, async (req, res) => {
  console.log(req.user.id, req.body);
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json("user not found");
  const existMail = await User.find({ email: req.body.email });
  const existUser = await User.find({name : req.body.name});
 // console.log(existMail[0]._id, req.body.email, req.user.id);
  if ((existMail.length > 0 && existMail[0]._id.toString() != req.user.id) || (existUser.length > 0 && existUser[0]._id.toString() != req.user.id))
  {
    console.log(existMail);
    console.log(existUser);
    return res.status(403).json({});
  }
  if (req.user.id !== user._id.toString()) return res.status(403).json("not allowed to update this user");
  if (req.files?.image) {
    req.body.image = upload(req.files.image);
  }
  
  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
  res.status(200).json(updatedUser);
});
app.delete("/users/:id",auth, isAdmin, async (req, res) =>{
  console.log(req.params.id);
  console.log(req.user);
  const user = await User.findById(req.params.id);
  console.log(user);
  if (user.role == "admin") return res.status(403).send("can't delete admin");
  return res.status(200).json(await User.deleteOne({ _id: req.params.id }));
  console.log(user);
})
app.get('/image/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'uploads', imageName);
  console.log(imagePath);
  res.sendFile(imagePath);
  //console.log(res);
});
app.put("/orders/:id", auth, async (req, res) => {
  
  console.log(req.user.id, req.body.status, req.params);
  const order = await Order.findById(req.params.id);
  console.log(order, req.user.id, req.body.status);
  if (order)
  {
    if ((order.userId == req.user.id && req.body.status == "cancel") || req.user.role == "admin") {
      
      return  res.status(200).json(await Order.updateOne({ _id: req.params.id }, { $set: {status: req.body.status} }));
    }
  }
  return res.status(403).json("not allowed to update this order status");
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
    const user = new User({ name, email, password: hashed, gender, image: url, role: "user" });

    await user.save();
    res.status(201).json(user);

  } catch (error) {
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

app.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.put("/orders/:id", auth, isAdmin, async (req, res) => {
  console.log("nerf this")
  await Order.updateOne({ _id: req.params.id }, { status: req.body.status });
  return res.send("order updated");
});

app.delete("/orders/:id", auth, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
  if (!order || order.status !== "pending") return res.status(403).json("not allowed");

  await Order.deleteOne({ _id: req.params.id });
  res.send("order canceled");
});

app.listen(3000, () => console.log("server is running on port 3000"));
