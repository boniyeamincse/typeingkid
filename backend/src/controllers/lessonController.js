import prisma from '../db.js';

const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const DIFFICULTY_RANK = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

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
      orderBy: [{ difficulty: 'asc' }, { order_index: 'asc' }],
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

// ─── Protected: Get a lesson by difficulty + order index ─────────────────────
// @route  GET /api/lessons/difficulty/:difficulty/order/:orderIndex
// @access Protected
export const getLessonByDifficultyAndOrder = async (req, res) => {
  const { difficulty, orderIndex } = req.params;

  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    return res
      .status(400)
      .json({ message: `difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}` });
  }

  const parsedOrder = Number.parseInt(orderIndex, 10);
  if (Number.isNaN(parsedOrder) || parsedOrder < 0) {
    return res.status(400).json({ message: 'orderIndex must be a non-negative integer.' });
  }

  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        is_active: true,
        difficulty,
        order_index: parsedOrder,
      },
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    res.json(lesson);
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

// ─── Protected: Get user lesson progress summary ─────────────────────────────
// @route  GET /api/lessons/progress/summary?difficulty=beginner
// @access Protected
export const getMyLessonProgressSummary = async (req, res) => {
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
      orderBy: [{ difficulty: 'asc' }, { order_index: 'asc' }],
      include: {
        lessonProgress: {
          where: { user_id: req.user.id },
          orderBy: { completed_at: 'desc' },
        },
      },
    });

    const summary = lessons.map((lesson) => {
      const attempts = lesson.lessonProgress.length;
      const bestWpm = attempts > 0 ? Math.max(...lesson.lessonProgress.map((item) => item.wpm)) : null;
      const bestAccuracy =
        attempts > 0 ? Math.max(...lesson.lessonProgress.map((item) => item.accuracy)) : null;
      const lastCompletedAt = attempts > 0 ? lesson.lessonProgress[0].completed_at : null;

      return {
        id: lesson.id,
        title: lesson.title,
        difficulty: lesson.difficulty,
        order_index: lesson.order_index,
        is_active: lesson.is_active,
        attempts,
        best_wpm: bestWpm,
        best_accuracy: bestAccuracy,
        last_completed_at: lastCompletedAt,
        is_completed: attempts > 0,
      };
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Protected: Get adaptive next lesson recommendation ──────────────────────
// @route  GET /api/lessons/:id/adaptive-next?wpm=42&accuracy=96
// @access Protected
export const getAdaptiveLessonSuggestion = async (req, res) => {
  const { id } = req.params;
  const qAccuracy = req.query.accuracy;
  const qWpm = req.query.wpm;

  const accuracy = qAccuracy !== undefined ? Number.parseInt(qAccuracy, 10) : null;
  const wpm = qWpm !== undefined ? Number.parseInt(qWpm, 10) : null;

  if (accuracy !== null && (Number.isNaN(accuracy) || accuracy < 0 || accuracy > 100)) {
    return res.status(400).json({ message: 'accuracy must be an integer between 0 and 100.' });
  }
  if (wpm !== null && (Number.isNaN(wpm) || wpm < 0)) {
    return res.status(400).json({ message: 'wpm must be a non-negative integer.' });
  }

  try {
    const currentLesson = await prisma.lesson.findUnique({ where: { id } });
    if (!currentLesson || !currentLesson.is_active) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    const currentRank = DIFFICULTY_RANK[currentLesson.difficulty] ?? 0;
    const nextDifficulty = VALID_DIFFICULTIES[currentRank + 1] ?? null;

    const [nextInSameDifficulty, firstLessonNextDifficulty] = await Promise.all([
      prisma.lesson.findFirst({
        where: {
          is_active: true,
          difficulty: currentLesson.difficulty,
          order_index: { gt: currentLesson.order_index },
        },
        orderBy: { order_index: 'asc' },
      }),
      nextDifficulty
        ? prisma.lesson.findFirst({
            where: {
              is_active: true,
              difficulty: nextDifficulty,
            },
            orderBy: { order_index: 'asc' },
          })
        : Promise.resolve(null),
    ]);

    let recommendation = null;

    if (accuracy !== null && accuracy < 85) {
      recommendation = {
        type: 'retry',
        message: 'Accuracy is below 85%, so we recommend repeating this lesson for stronger consistency.',
        lesson: currentLesson,
      };
    } else if (accuracy !== null && wpm !== null && accuracy >= 97 && wpm >= 45 && firstLessonNextDifficulty) {
      recommendation = {
        type: 'promote',
        message: `Strong performance detected. Try moving up to ${nextDifficulty}.`,
        lesson: firstLessonNextDifficulty,
      };
    } else if (nextInSameDifficulty) {
      recommendation = {
        type: 'next',
        message: 'Great work. Continue to the next lesson in your current track.',
        lesson: nextInSameDifficulty,
      };
    } else if (firstLessonNextDifficulty) {
      recommendation = {
        type: 'promote',
        message: `You completed this track. Time to move up to ${nextDifficulty}.`,
        lesson: firstLessonNextDifficulty,
      };
    } else {
      recommendation = {
        type: 'complete',
        message: 'You have completed all available lessons. Keep practicing to improve speed and accuracy.',
        lesson: null,
      };
    }

    const lessonPayload = recommendation.lesson
      ? {
          id: recommendation.lesson.id,
          title: recommendation.lesson.title,
          difficulty: recommendation.lesson.difficulty,
          order_index: recommendation.lesson.order_index,
        }
      : null;

    res.json({
      current_lesson: {
        id: currentLesson.id,
        title: currentLesson.title,
        difficulty: currentLesson.difficulty,
        order_index: currentLesson.order_index,
      },
      recommendation: {
        type: recommendation.type,
        message: recommendation.message,
        lesson: lessonPayload,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
