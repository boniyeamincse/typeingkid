import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedUsers = [
  {
    email: 'demo_user@typingkids.dev',
    display_name: 'Demo User',
    password: 'DemoUser123!',
    role: 'USER',
  },
  {
    email: 'demo_educator@typingkids.dev',
    display_name: 'Demo Educator',
    password: 'DemoEducator123!',
    role: 'EDUCATOR',
  },
  {
    email: 'demo_admin@typingkids.dev',
    display_name: 'Demo Admin',
    password: 'DemoAdmin123!',
    role: 'ADMIN',
  },
];

const beginnerAlphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

const buildBeginnerLessonContent = (letter) => {
  // Keep early lessons simple: single-key rhythm with spaces.
  const block = `${letter} ${letter} ${letter} ${letter}`;
  return `${block} ${block} ${block}`;
};

const beginnerLessons = beginnerAlphabet.map((letter, index) => ({
  title: `Lesson ${String(index + 1).padStart(2, '0')} - ${letter.toUpperCase()} Key`,
  content: buildBeginnerLessonContent(letter),
  difficulty: 'beginner',
  order_index: index,
  is_active: true,
}));

const seed = async () => {
  for (const user of seedUsers) {
    const password_hash = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        display_name: user.display_name,
        password_hash,
        role: user.role,
      },
      create: {
        email: user.email,
        display_name: user.display_name,
        password_hash,
        role: user.role,
      },
    });
  }

  for (const lesson of beginnerLessons) {
    const existingLesson = await prisma.lesson.findFirst({
      where: {
        difficulty: lesson.difficulty,
        order_index: lesson.order_index,
      },
      select: { id: true },
    });

    if (existingLesson) {
      await prisma.lesson.update({
        where: { id: existingLesson.id },
        data: {
          title: lesson.title,
          content: lesson.content,
          is_active: lesson.is_active,
        },
      });
    } else {
      await prisma.lesson.create({ data: lesson });
    }
  }

  console.log('Seeded demo accounts: demo_user, demo_educator, demo_admin');
  console.log('Seeded beginner lessons: 26 lessons (A-Z)');
};

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
