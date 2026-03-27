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

const LESSONS_PER_LEVEL = 100;

const TWO_LETTER_POOL = PRACTICE_ITEMS.filter((item) => item.type === 'two_letter').map((item) => item.value);
const THREE_LETTER_POOL = PRACTICE_ITEMS.filter((item) => item.type === 'three_letter').map((item) => item.value);

const toNumberLabel = (index) => String(index + 1).padStart(3, '0');

const rotatePick = (pool, start, size) => {
  const picked = [];
  for (let i = 0; i < size; i++) {
    picked.push(pool[(start + i) % pool.length]);
  }
  return picked;
};

const buildBeginnerComboContent = (index) => {
  const twoLetterSet = rotatePick(TWO_LETTER_POOL, index * 2, 8);
  const threeLetterSet = rotatePick(THREE_LETTER_POOL, index * 3, 4);
  return `${twoLetterSet.join(' ')} ${threeLetterSet.join(' ')} ${twoLetterSet.join(' ')}`;
};

const buildIntermediateSentence = (index) => {
  const a = TWO_LETTER_POOL[index % TWO_LETTER_POOL.length];
  const b = THREE_LETTER_POOL[(index * 2) % THREE_LETTER_POOL.length];
  const c = THREE_LETTER_POOL[(index * 5) % THREE_LETTER_POOL.length];
  return `Lesson ${index + 1} trains sentence rhythm, so keep your pace steady, type with control, and flow through ${a}, ${b}, and ${c} patterns with clear punctuation.`;
};

const buildAdvancedParagraph = (index) => {
  const a = THREE_LETTER_POOL[index % THREE_LETTER_POOL.length];
  const b = THREE_LETTER_POOL[(index * 3) % THREE_LETTER_POOL.length];
  const c = TWO_LETTER_POOL[(index * 4) % TWO_LETTER_POOL.length];
  return `Advanced lesson ${index + 1} focuses on full-paragraph endurance and precision. Read ahead, maintain a light touch, and recover quickly when you miss a key. Keep your rhythm stable while passing through ${a}, ${b}, and ${c} clusters, and protect accuracy as speed rises across every sentence in this drill.`;
};

const beginnerLessons = Array.from({ length: LESSONS_PER_LEVEL }, (_, index) => ({
  title: `Beginner ${toNumberLabel(index)} - Combo Letters`,
  content: buildBeginnerComboContent(index),
  difficulty: 'beginner',
  order_index: index,
  is_active: true,
}));

const intermediateLessons = Array.from({ length: LESSONS_PER_LEVEL }, (_, index) => ({
  title: `Intermediate ${toNumberLabel(index)} - Sentence Flow`,
  content: buildIntermediateSentence(index),
  difficulty: 'intermediate',
  order_index: index,
  is_active: true,
}));

const advancedLessons = Array.from({ length: LESSONS_PER_LEVEL }, (_, index) => ({
  title: `Advanced ${toNumberLabel(index)} - Paragraph Training`,
  content: buildAdvancedParagraph(index),
  difficulty: 'advanced',
  order_index: index,
  is_active: true,
}));

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons];

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
  console.log(`✅ Seeded lessons: ${LESSONS_PER_LEVEL} beginner (combo letters), ${LESSONS_PER_LEVEL} intermediate (sentences), ${LESSONS_PER_LEVEL} advanced (paragraphs)`);
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
