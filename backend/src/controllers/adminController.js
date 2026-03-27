import prisma from '../db.js';

const VALID_ROLES = ['USER', 'EDUCATOR', 'ADMIN'];

// @desc    List users for administration
// @route   GET /api/admin/users
// @access  ADMIN
export const listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        display_name: true,
        role: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  ADMIN
export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: `role must be one of: ${VALID_ROLES.join(', ')}` });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: {
        id: true,
        email: true,
        display_name: true,
        role: true,
      },
    });

    res.json(updated);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(500).json({ message: error.message });
  }
};
