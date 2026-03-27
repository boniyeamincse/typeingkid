import prisma from '../db.js';

const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

// ─── Admin: Create a lesson ────────────────────────────────────────────────────
// @route  POST /api/lessons
// @access Admin
export const createLesson = async (req, res) => {
  const { title, content, difficulty, order_index } = req.body;

  if (!title || !content || !difficulty) {
    return res.status(400).json({ message: 'title, content, and difficulty are required.' });
  }
  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    return res
      .status(400)
      .json({ message: `difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}` });
  }

  try {
    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        difficulty,
        order_index: order_index ?? 0,
      },
    });
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Admin: Get all lessons (including inactive) ───────────────────────────────
// @route  GET /api/lessons/admin
// @access Admin
export const getAllLessonsAdmin = async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: [{ difficulty: 'asc' }, { order_index: 'asc' }],
    });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Admin: Update a lesson ────────────────────────────────────────────────────
// @route  PUT /api/lessons/:id
// @access Admin
export const updateLesson = async (req, res) => {
  const { title, content, difficulty, order_index, is_active } = req.body;

  if (difficulty && !VALID_DIFFICULTIES.includes(difficulty)) {
    return res
      .status(400)
      .json({ message: `difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}` });
  }

  try {
    const lesson = await prisma.lesson.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(difficulty !== undefined && { difficulty }),
        ...(order_index !== undefined && { order_index }),
        ...(is_active !== undefined && { is_active }),
      },
    });
    res.json(lesson);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Lesson not found.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// ─── Admin: Delete a lesson ────────────────────────────────────────────────────
// @route  DELETE /api/lessons/:id
// @access Admin
export const deleteLesson = async (req, res) => {
  try {
    await prisma.lesson.delete({ where: { id: req.params.id } });
    res.json({ message: 'Lesson deleted.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Lesson not found.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// ─── Public: Get active lessons by difficulty ──────────────────────────────────
// @route  GET /api/lessons?difficulty=beginner
// @access Protected
export const getLessonsByDifficulty = async (req, res) => {
  const { difficulty } = req.query;

  if (difficulty && !VALID_DIFFICULTIES.includes(difficulty)) {
    return res
      .status(400)
      .json({ message: `difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}` });
  }

  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        is_active: true,
        ...(difficulty && { difficulty }),
      },
      orderBy: { order_index: 'asc' },
      select: {
        id: true,
        title: true,
        difficulty: true,
        order_index: true,
        // content intentionally omitted from list — fetched per-lesson
      },
    });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Public: Get a single active lesson ───────────────────────────────────────
// @route  GET /api/lessons/:id
// @access Protected
export const getLesson = async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
    });

    if (!lesson || !lesson.is_active) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Protected: Save lesson progress ──────────────────────────────────────────
// @route  POST /api/lessons/:id/progress
// @access Protected
export const saveLessonProgress = async (req, res) => {
  const { wpm, accuracy } = req.body;

  if (wpm === undefined || accuracy === undefined) {
    return res.status(400).json({ message: 'wpm and accuracy are required.' });
  }
  if (!Number.isInteger(wpm) || wpm < 0) {
    return res.status(400).json({ message: 'wpm must be a non-negative integer.' });
  }
  if (!Number.isInteger(accuracy) || accuracy < 0 || accuracy > 100) {
    return res.status(400).json({ message: 'accuracy must be an integer between 0 and 100.' });
  }

  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } });
    if (!lesson || !lesson.is_active) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    const progress = await prisma.lessonProgress.create({
      data: {
        user_id: req.user.id,
        lesson_id: req.params.id,
        wpm,
        accuracy,
      },
    });
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Protected: Get user's progress for a lesson ──────────────────────────────
// @route  GET /api/lessons/:id/progress
// @access Protected
export const getLessonProgress = async (req, res) => {
  try {
    const records = await prisma.lessonProgress.findMany({
      where: { user_id: req.user.id, lesson_id: req.params.id },
      orderBy: { completed_at: 'desc' },
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
