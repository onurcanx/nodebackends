const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const axios = require("axios");
const { spawn } = require("child_process");
require("dotenv").config();

// Kullanıcı bilgilerini getir
router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Kullanıcı ID:", id);
    
    // created_at sütunu olmadığı için sadece temel bilgileri getir
    const user = await pool.query(
      "SELECT id, username, email, is_admin FROM users WHERE id = $1", 
      [id]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    console.log("Kullanıcı bulundu:", user.rows[0]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error("Kullanıcı bilgileri alınırken hata:", err);
    res.status(500).json({ 
      message: "Sunucu hatası",
      error: err.message
    });
  }
});

// Kayıt olma
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1 OR username = $2", [email, username]);
    if (existingUser.rows.length > 0) return res.status(400).json({ message: "Bu e-posta veya kullanıcı adı zaten kayıtlı!" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *", [username, email, hashedPassword]);
    res.json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});
//Login
router.post("/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE username = $1 OR email = $1", [usernameOrEmail]);
    if (user.rows.length === 0) return res.status(401).json({ message: "Geçersiz kullanıcı adı veya e-posta" });
    
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(401).json({ message: "Geçersiz şifre" });
    
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ 
      token, 
      user_id: user.rows[0].id,
      username: user.rows[0].username 
    });
  } catch (err) {
    res.status(500).send("Server hatası");
  }
});
module.exports = router; 
