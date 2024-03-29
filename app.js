require("dotenv").config();
require("express-async-errors");

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const cloudinary = require("cloudinary").v2;

const connectDB = require("./db/connect");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const express = require("express");

const app = express();

const PORT = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static("./public"));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("e-commerce-app");
});

app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("e-commerce-app");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);

app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log("Server is running on PORT " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
