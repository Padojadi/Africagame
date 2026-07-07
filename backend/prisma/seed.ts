import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const countries = [
  { name: 'Tunisie', code: 'TUN', flagEmoji: '🇹🇳' },
  { name: 'Maroc', code: 'MAR', flagEmoji: '🇲🇦' },
  { name: 'Algérie', code: 'DZA', flagEmoji: '🇩🇿' },
  { name: 'Cameroun', code: 'CMR', flagEmoji: '🇨🇲' },
  { name: "Côte d'Ivoire", code: 'CIV', flagEmoji: '🇨🇮' },
  { name: 'Gabon', code: 'GAB', flagEmoji: '🇬🇦' },
  { name: 'Sénégal', code: 'SEN', flagEmoji: '🇸🇳' },
  { name: 'Mauritanie', code: 'MRT', flagEmoji: '🇲🇷' },
  { name: 'Tchad', code: 'TCD', flagEmoji: '🇹🇩' },
  { name: 'France', code: 'FRA', flagEmoji: '🇫🇷' },
];

async function main() {
  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: {},
      create: country,
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@africagame.2ticglobal.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Africagame!@#2026';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword, role: 'ADMIN', active: true },
    create: {
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Africa Game',
      role: 'ADMIN',
      active: true,
    },
  });

  const tunisia = await prisma.country.findUnique({ where: { code: 'TUN' } });

  const courses = [
    {
      title: 'Introduction à Unreal Engine',
      description: 'Découvrez les bases du moteur Unreal Engine pour la création de jeux vidéo.',
      moduleOrder: 1,
      duration: 120,
      published: true,
    },
    {
      title: 'Blueprint - Programmation visuelle',
      description: 'Apprenez la programmation nodale avec les Blueprints d\'Unreal Engine.',
      moduleOrder: 2,
      duration: 180,
      published: true,
    },
    {
      title: 'Storytelling Africain en Jeu Vidéo',
      description: 'Intégrez le patrimoine culturel africain dans vos prototypes de jeux.',
      moduleOrder: 3,
      duration: 90,
      published: true,
    },
  ];

  for (const course of courses) {
    const existing = await prisma.course.findFirst({ where: { title: course.title } });
    if (!existing) {
      await prisma.course.create({ data: course });
    }
  }

  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (admin && tunisia) {
    const existingHackathon = await prisma.hackathon.findFirst({
      where: { title: 'Hackathon Panafricain Africa Game 2026' },
    });
    if (!existingHackathon) {
      await prisma.hackathon.create({
        data: {
          title: 'Hackathon Panafricain Africa Game 2026',
          description:
            'Hackathon en ligne réunissant les talents africains pour créer des prototypes de jeux vidéo basés sur le patrimoine culturel africain.',
          startDate: new Date('2026-09-07'),
          endDate: new Date('2026-12-15'),
          maxTeams: 10,
          quotaPerCountry: 5,
          status: 'REGISTRATION_OPEN',
          countryId: tunisia.id,
        },
      });
    }

    const existingNews = await prisma.news.findFirst({
      where: { title: 'Bienvenue sur la Plateforme Panafricaine Africa Game' },
    });
    if (!existingNews) {
      await prisma.news.create({
        data: {
          title: 'Bienvenue sur la Plateforme Panafricaine Africa Game',
          content:
            'Africa Game est une initiative panafricaine pour former et accompagner les jeunes talents africains passionnés par la création de jeux vidéo. Inscrivez-vous, soumettez votre projet et rejoignez la communauté !',
          published: true,
          authorId: admin.id,
        },
      });
    }
  }

  console.log('Seed completed. Admin:', adminEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
