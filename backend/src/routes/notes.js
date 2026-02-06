const express = require('express');
const { pool } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const [notes] = await pool.query(
      'SELECT id, title, LEFT(content, 200) as preview, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY updated_at DESC',
      [req.userId]
    );
    res.json({ notes });
  } catch (err) {
    console.error('List notes error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }
    const searchTerm = `%${q}%`;
    const [notes] = await pool.query(
      'SELECT id, title, LEFT(content, 200) as preview, created_at, updated_at FROM notes WHERE user_id = ? AND (title LIKE ? OR content LIKE ?) ORDER BY updated_at DESC',
      [req.userId, searchTerm, searchTerm]
    );
    res.json({ notes });
  } catch (err) {
    console.error('Search notes error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [notes] = await pool.query(
      'SELECT * FROM notes WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );
    if (notes.length === 0) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }
    res.json({ note: notes[0] });
  } catch (err) {
    console.error('Get note error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    const [result] = await pool.query(
      'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
      [req.userId, title || 'Sin título', content || '']
    );
    const [notes] = await pool.query('SELECT * FROM notes WHERE id = ?', [result.insertId]);
    res.status(201).json({ note: notes[0] });
  } catch (err) {
    console.error('Create note error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const [existing] = await pool.query(
      'SELECT id FROM notes WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }

    const updates = [];
    const values = [];
    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (content !== undefined) { updates.push('content = ?'); values.push(content); }

    if (updates.length > 0) {
      values.push(req.params.id, req.userId);
      await pool.query(
        `UPDATE notes SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
        values
      );
    }

    const [notes] = await pool.query('SELECT * FROM notes WHERE id = ?', [req.params.id]);
    res.json({ note: notes[0] });
  } catch (err) {
    console.error('Update note error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [existing] = await pool.query(
      'SELECT id FROM notes WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }

    await pool.query('DELETE FROM notes WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    res.json({ message: 'Nota eliminada correctamente' });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
