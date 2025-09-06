const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const { connection } = require("mongoose");
const db = require("./config/mongoose-connection");
const expressSession = require("express-session");
const flash = require("connect-flash");

require("dotenv").config();

// ✅ Routers
const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index");

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Fix: Ensure the session secret exists
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET || "fallbackSecret123", // fallback if env var is missing
    })
);

app.use(flash());

// ✅ Fix: Correct template engine key
app.set("view engine", "ejs"); // ❌ "views engine" → ✅ "view engine"

// ✅ Static files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Mount routers
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/", indexRouter);

// ✅ Start server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
