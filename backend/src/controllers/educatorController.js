import prisma from '../db.js';

const canAccessClassroom = (user, classroom) => {
  if (!classroom) return false;
  if (user.role === 'ADMIN') return true;
  return classroom.educator_id === user.id;
};

// @desc    Create classroom
// @route   POST /api/educator/classes
// @access  EDUCATOR, ADMIN
export const createClassroom = async (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: 'Classroom name is required.' });
  }

  try {
    const classroom = await prisma.classroom.create({
      data: {
        name: name.trim(),
        educator_id: req.user.id,
      },
    });
    res.status(201).json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    List educator classrooms
// @route   GET /api/educator/classes
// @access  EDUCATOR, ADMIN
export const listClassrooms = async (req, res) => {
  try {
    const classrooms = await prisma.classroom.findMany({
      where: req.user.role === 'ADMIN' ? {} : { educator_id: req.user.id },
      include: {
        _count: {
          select: {
            members: true,
            assignments: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add student to classroom by email
// @route   POST /api/educator/classes/:id/students
// @access  EDUCATOR, ADMIN
export const addStudentToClassroom = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Student email is required.' });
  }

  try {
    const classroom = await prisma.classroom.findUnique({ where: { id: req.params.id } });
    if (!canAccessClassroom(req.user, classroom)) {
      return res.status(403).json({ message: 'Not allowed to modify this classroom.' });
    }

    const student = await prisma.user.findUnique({ where: { email } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    if (student.role !== 'USER') {
      return res.status(400).json({ message: 'Only USER accounts can be added as students.' });
    }

    const membership = await prisma.classroomMembership.upsert({
      where: {
        classroom_id_student_id: {
          classroom_id: req.params.id,
          student_id: student.id,
        },
      },
      update: {},
      create: {
        classroom_id: req.params.id,
        student_id: student.id,
      },
    });

    res.status(201).json(membership);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign lesson to a classroom
// @route   POST /api/educator/classes/:id/assignments
// @access  EDUCATOR, ADMIN
export const assignLessonToClassroom = async (req, res) => {
  const { lesson_id, due_at } = req.body;

  if (!lesson_id) {
    return res.status(400).json({ message: 'lesson_id is required.' });
  }

  try {
    const classroom = await prisma.classroom.findUnique({ where: { id: req.params.id } });
    if (!canAccessClassroom(req.user, classroom)) {
      return res.status(403).json({ message: 'Not allowed to modify this classroom.' });
    }

    const lesson = await prisma.lesson.findUnique({ where: { id: lesson_id } });
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    const assignment = await prisma.lessonAssignment.create({
      data: {
        classroom_id: req.params.id,
        lesson_id,
        due_at: due_at ? new Date(due_at) : null,
      },
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get classroom progress report
// @route   GET /api/educator/classes/:id/reports
// @access  EDUCATOR, ADMIN
export const getClassroomReport = async (req, res) => {
  try {
    const classroom = await prisma.classroom.findUnique({
      where: { id: req.params.id },
      include: {
        members: {
          include: {
            student: {
              select: {
                id: true,
                email: true,
                display_name: true,
              },
            },
          },
        },
        assignments: true,
      },
    });

    if (!canAccessClassroom(req.user, classroom)) {
      return res.status(403).json({ message: 'Not allowed to view this classroom report.' });
    }

    const studentIds = classroom.members.map((m) => m.student_id);

    const progressRows = await prisma.lessonProgress.findMany({
      where: {
        user_id: { in: studentIds },
      },
      select: {
        user_id: true,
        wpm: true,
        accuracy: true,
      },
    });

    const studentStats = classroom.members.map((member) => {
      const rows = progressRows.filter((p) => p.user_id === member.student_id);
      const sessions = rows.length;
      const avgWpm = sessions ? Math.round(rows.reduce((sum, row) => sum + row.wpm, 0) / sessions) : 0;
      const avgAccuracy = sessions
        ? Math.round(rows.reduce((sum, row) => sum + row.accuracy, 0) / sessions)
        : 0;

      return {
        student: member.student,
        sessions,
        avgWpm,
        avgAccuracy,
      };
    });

    res.json({
      classroom: {
        id: classroom.id,
        name: classroom.name,
        created_at: classroom.created_at,
      },
      assignmentCount: classroom.assignments.length,
      studentStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
