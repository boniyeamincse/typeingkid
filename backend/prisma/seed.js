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

// ── Practice items ────────────────────────────────────────────────────────────
const PRACTICE_ITEMS = [
  ...beginnerAlphabet.map((l) => ({ type: 'letter', value: l })),
  ...['ab','ac','ad','ae','af','ag','ah','ai','al','am',
      'an','ar','as','at','au','ay','ba','be','bi','br',
      'bu','ca','ch','cl','co','cr','cu','de','di','do',
      'dr','du','ea','ed','el','en','er','es','et','ev',
      'ex','fa','fi','fl','fo','fr','fu','ga','ge','gi']
    .map((v) => ({ type: 'two_letter', value: v })),
  ...['the','and','for','are','but','not','you','all','can','her',
      'was','one','our','out','day','get','has','him','his','how',
      'man','new','now','old','see','two','way','who','boy','did',
      'its','let','put','say','she','too','use','cat','dog','fun',
      'hat','map','run','sit','sun','top','big','cup','egg','fig']
    .map((v) => ({ type: 'three_letter', value: v })),
];

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

// ── Home-row lessons (27+) ────────────────────────────────────────────────────
const homeRowLessons = [
  {
    title: 'Lesson 27 - Home Row Left (asdf)',
    content: 'asdf asdf asdf fdsa fdsa fdsa asdf fdsa asdf asdf fdsa fdsa asdf fdsa asdf',
    difficulty: 'beginner',
    order_index: 26,
    is_active: true,
  },
  {
    title: 'Lesson 28 - Home Row Right (jkl;)',
    content: 'jkl; jkl; jkl; ;lkj ;lkj ;lkj jkl; ;lkj jkl; jkl; ;lkj ;lkj jkl; ;lkj jkl;',
    difficulty: 'beginner',
    order_index: 27,
    is_active: true,
  },
  {
    title: 'Lesson 29 - Full Home Row (asdf jkl;)',
    content: 'asdf jkl; asdf jkl; fdsa ;lkj fdsa ;lkj asdf jkl; fdsa ;lkj asdf jkl; fdsa',
    difficulty: 'beginner',
    order_index: 28,
    is_active: true,
  },
  {
    title: 'Lesson 30 - Home Row Words',
    content: 'add ask dad fall glad hall jazz lad salad flask shall jabs flask ash lads fall',
    difficulty: 'beginner',
    order_index: 29,
    is_active: true,
  },
  {
    title: 'Lesson 31 - Home Row Mixed Drill',
    content: 'asd fgh jkl asl jfk dak sal fads jak lad flag glad asdf jkl; asdf fdsa ;lkj',
    difficulty: 'beginner',
    order_index: 30,
    is_active: true,
  },
  {
    title: 'Lesson 32 - Home Row Speed Build',
    content: 'ask flask glass flask ask glad sad lads lass flask falls glad glass ask lads sad flask glad',
    difficulty: 'beginner',
    order_index: 31,
    is_active: true,
  },
];

const allBeginnerLessons = [...beginnerLessons, ...homeRowLessons];

const intermediateLessons = [
  {
    title: 'Intermediate 01 - Clean Sentence Flow',
    content: 'Typing with steady rhythm helps you stay accurate when words get longer.',
    difficulty: 'intermediate',
    order_index: 0,
    is_active: true,
  },
  {
    title: 'Intermediate 02 - Punctuation Control',
    content: 'Practice commas, periods, and question marks so your speed stays smooth.',
    difficulty: 'intermediate',
    order_index: 1,
    is_active: true,
  },
  {
    title: 'Intermediate 03 - Sentence Switching',
    content: 'Read the next phrase early, then type with relaxed hands and clear focus.',
    difficulty: 'intermediate',
    order_index: 2,
    is_active: true,
  },
  {
    title: 'Intermediate 04 - Mixed Patterns',
    content: 'Fast learners keep accuracy high by slowing down before difficult letter groups.',
    difficulty: 'intermediate',
    order_index: 3,
    is_active: true,
  },
  {
    title: 'Intermediate 05 - Real Sentence Drill',
    content: 'Small daily practice sessions build confidence, speed, and long-term typing stamina.',
    difficulty: 'intermediate',
    order_index: 4,
    is_active: true,
  },
  {
    title: 'Intermediate 06 - Accuracy Under Speed',
    content: 'When your pace increases, keep your eyes ahead and trust your finger memory.',
    difficulty: 'intermediate',
    order_index: 5,
    is_active: true,
  },
];

const advancedLessons = [
  {
    title: 'Advanced 01 - Focused Paragraph',
    content:
      'Strong typists maintain a consistent rhythm across full paragraphs. They scan upcoming words, react calmly to punctuation, and recover quickly from mistakes without losing momentum.',
    difficulty: 'advanced',
    order_index: 0,
    is_active: true,
  },
  {
    title: 'Advanced 02 - Performance Paragraph',
    content:
      'To type at a high level, combine precision with endurance. Keep your wrists relaxed, avoid unnecessary force, and use deliberate breathing to stay steady through long passages.',
    difficulty: 'advanced',
    order_index: 1,
    is_active: true,
  },
  {
    title: 'Advanced 03 - Challenge Paragraph',
    content:
      'Advanced training is not only about speed. It is about control under pressure, quick adaptation to unfamiliar text, and the discipline to protect accuracy in every session.',
    difficulty: 'advanced',
    order_index: 2,
    is_active: true,
  },
  {
    title: 'Advanced 04 - Endurance Paragraph',
    content:
      'Long-form typing rewards consistency. As your pace rises, your technique must remain clean: smooth key travel, light touch, and steady attention from the first sentence to the last.',
    difficulty: 'advanced',
    order_index: 3,
    is_active: true,
  },
];

const allLessons = [...allBeginnerLessons, ...intermediateLessons, ...advancedLessons];

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

  for (const lesson of allLessons) {
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

  // Seed practice items (upsert so safe to re-run)
  let practiceCreated = 0;
  for (const item of PRACTICE_ITEMS) {
    await prisma.practiceItem.upsert({
      where: { type_value: { type: item.type, value: item.value } },
      update: { is_active: true },
      create: item,
    });
    practiceCreated++;
  }

  console.log('✅ Seeded demo accounts: demo_user, demo_educator, demo_admin');
  console.log('✅ Seeded lessons: beginner, intermediate (sentences), advanced (paragraphs)');
  console.log(`✅ Seeded ${practiceCreated} practice items (letters + combos)`);
};

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
