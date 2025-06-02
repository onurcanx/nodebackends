const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../config/db');
const axios = require('axios');

// Yorum ekleme
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, comment } = req.body;
    const userId = req.user.id;

    // Python backend'e yorum analizi için gönderme
    const analysisResponse = await axios.post(
      `${process.env.PYTHON_BACKEND_URL}/analyze`,
      { text: comment }
    );

    const { sentiment, sentiment_score, keywords } = analysisResponse.data;

    // Yorumu veritabanına kaydetme
    const result = await pool.query(
      `INSERT INTO comments (user_id, movie_id, comment, sentiment, sentiment_score, keywords)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, movieId, comment, sentiment, sentiment_score, keywords]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Film yorumlarını getirme
router.get("/comments/:movie_id", async (req, res) => {
    try {
      const { movie_id } = req.params;
      const comments = await pool.query("SELECT comments.*, users.username FROM comments INNER JOIN users ON comments.user_id = users.id WHERE movie_id = $1 ORDER BY created_at DESC", [movie_id]);
      res.json(comments.rows);
    } catch (err) {
      res.status(500).send("Server hatası");
    }
  });

module.exports = router; 