const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const dotenv = require("dotenv");
const supabase = require("./config/database.js");
const cors = require("cors");

// dotenv.config();
const app = express();

//middleware
app.use(express.json());
app.use(cors());

//middleware auth jwt
const authenticationToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; //men-format bearer token

  if (!token) {
    return res.status(401).json({ message: "Token Required!" });
  }

  jwt.verify(token, process.env.SUPABASE_JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Invalid Token!" });
    }
    req.user = user;
    next();
  });
};

//env debugger
app.get('/debug-env', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL ? 'Ada' : 'Tidak Ada',
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Ada' : 'Tidak Ada',
    jwtSecret: process.env.SUPABASE_JWT_SECRET ? 'Ada' : 'Tidak Ada',
    fullSupabaseUrl: process.env.SUPABASE_URL || 'Tidak Terdeteksi'
  });
});

//endpoint register pengguna baru
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from("users")
      .insert({
        username: username,
        password: hashedPassword,
      })
      .select();

    if (error) throw error;

    res.status(201).json({ message: "User registered", userId: data[0].id });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error registering user", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error) throw error;

    const isPasswordValid = await bcrypt.compare(password, data.password);

    if (!data || !isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: data.id, username: data.username },
      process.env.SUPABASE_JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error Logging In", error: err.message });
  }
});

//endpoint contoh yang dilindungi auth
app.get("/protected", authenticationToken, (req, res) => {
  res.json({ message: "This is protected route", user: req.user });
});

module.exports = app;
