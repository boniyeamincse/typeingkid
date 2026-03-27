import prisma from '../db.js';

const VALID_TYPES = ['letter', 'two_letter', 'three_letter'];
const VALID_PRACTICE_TYPES = ['alphabet', 'two_letter', 'three_letter', 'combo_game'];

// ── GET /api/practice/items?type=letter  (Protected) ─────────────────────────
// Returns all active practice items, optionally filtered by type.
export const getPracticeItems = async (req, res) => {
  const { type } = req.query;

  if (type && !VALID_TYPES.includes(type)) {
    return res.status(400).json({
      message: `type must be one of: ${VALID_TYPES.join(', ')}`,
    });
  }

  try {
    const items = await prisma.practiceItem.findMany({
      where: {
        is_active: true,
        ...(type && { type }),
      },
      orderBy: [{ type: 'asc' }, { value: 'asc' }],
      select: { id: true, type: true, value: true },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/practice/results  (Protected) ──────────────────────────────────
// Save a completed practice session result.
export const savePracticeResult = async (req, res) => {
  const { practice_type, score, accuracy, duration_secs } = req.body;

  if (!practice_type || score === undefined || accuracy === undefined || duration_secs === undefined) {
    return res.status(400).json({
      message: 'practice_type, score, accuracy, and duration_secs are required.',
    });
  }
  if (!VALID_PRACTICE_TYPES.includes(practice_type)) {
    return res.status(400).json({
      message: `practice_type must be one of: ${VALID_PRACTICE_TYPES.join(', ')}`,
    });
  }
  if (!Number.isInteger(score) || score < 0) {
    return res.status(400).json({ message: 'score must be a non-negative integer.' });
  }
  if (!Number.isInteger(accuracy) || accuracy < 0 || accuracy > 100) {
    return res.status(400).json({ message: 'accuracy must be 0–100.' });
  }
  if (!Number.isInteger(duration_secs) || duration_secs < 0) {
    return res.status(400).json({ message: 'duration_secs must be a non-negative integer.' });
  }

  try {
    const result = await prisma.practiceResult.create({
      data: {
        user_id: req.user.id,
        practice_type,
        score,
        accuracy,
        duration_secs,
      },
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/practice/results/me  (Protected) ────────────────────────────────
// Returns all practice results for the logged-in user, newest first.
export const getMyPracticeResults = async (req, res) => {
  const { practice_type, limit = '20' } = req.query;
  const take = Math.min(Number.parseInt(limit, 10) || 20, 100);

  try {
    const results = await prisma.practiceResult.findMany({
      where: {
        user_id: req.user.id,
        ...(practice_type && { practice_type }),
      },
      orderBy: { completed_at: 'desc' },
      take,
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/practice/results/me/best  (Protected) ───────────────────────────
// Returns personal best score & accuracy per practice_type for the logged-in user.
export const getMyBestResults = async (req, res) => {
  try {
    const rows = await prisma.practiceResult.findMany({
      where: { user_id: req.user.id },
      orderBy: { completed_at: 'desc' },
    });

    const bestMap = {};
    for (const row of rows) {
      if (!bestMap[row.practice_type]) {
        bestMap[row.practice_type] = { best_score: 0, best_accuracy: 0, attempts: 0 };
      }
      const entry = bestMap[row.practice_type];
      entry.attempts++;
      if (row.score > entry.best_score) entry.best_score = row.score;
      if (row.accuracy > entry.best_accuracy) entry.best_accuracy = row.accuracy;
    }

    res.json(bestMap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/practice/items  (Admin) ─────────────────────────────────────────
// Admin: add a new practice item.
export const createPracticeItem = async (req, res) => {
  const { type, value } = req.body;
  if (!type || !value) {
    return res.status(400).json({ message: 'type and value are required.' });
  }
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ message: `type must be one of: ${VALID_TYPES.join(', ')}` });
  }
  try {
    const item = await prisma.practiceItem.create({ data: { type, value: value.toLowerCase() } });
    res.status(201).json(item);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Practice item already exists.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE /api/practice/items/:id  (Admin) ───────────────────────────────────
// Admin: soft-delete (deactivate) a practice item.
export const deletePracticeItem = async (req, res) => {
  try {
    await prisma.practiceItem.update({
      where: { id: req.params.id },
      data: { is_active: false },
    });
    res.json({ message: 'Practice item deactivated.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Practice item not found.' });
    }
    res.status(500).json({ message: error.message });
  }
};
