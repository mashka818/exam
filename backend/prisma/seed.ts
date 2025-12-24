import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const courses = [
    {
      name: 'Основы программирования на Python',
      teacher: 'Иванов Иван Иванович',
      description: 'Изучите основы Python: синтаксис, структуры данных, ООП и многое другое',
      image: null, // Изображения нужно загружать через админ-панель
    },
    {
      name: 'Web-разработка на JavaScript',
      teacher: 'Петрова Мария Сергеевна',
      description: 'Создание современных веб-приложений с использованием JavaScript, React и Node.js',
      image: null,
    },
    {
      name: 'Машинное обучение и AI',
      teacher: 'Смирнов Алексей Петрович',
      description: 'Введение в машинное обучение, нейронные сети и искусственный интеллект',
      image: null,
    },
    {
      name: 'DevOps и облачные технологии',
      teacher: 'Козлова Елена Дмитриевна',
      description: 'Docker, Kubernetes, CI/CD и работа с облачными платформами',
      image: null,
    },
    {
      name: 'Базы данных и SQL',
      teacher: 'Новиков Дмитрий Александрович',
      description: 'Проектирование баз данных, SQL запросы, оптимизация и администрирование',
      image: null,
    },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { name: course.name },
      update: {
        // Не обновляем существующие данные, только создаем новые курсы
      },
      create: course,
    });
  }

  console.log('Создано курсов:', courses.length);

  const adminPassword = await argon2.hash('KorokNET');
  
  const admin = await prisma.user.upsert({
    where: { login: 'Admin' },
    update: {},
    create: {
      login: 'Admin',
      password: adminPassword,
      fullName: 'Администратор Системы',
      phone: '8(999)999-99-99',
      email: 'admin@korochki.est',
      role: UserRole.ADMIN,
    },
  });

  console.log('Администратор создан:', {
    login: admin.login,
    email: admin.email,
    role: admin.role,
  });

  const userPassword = await argon2.hash('testpass123');
  
  const testUser = await prisma.user.upsert({
    where: { login: 'testuser' },
    update: {},
    create: {
      login: 'testuser',
      password: userPassword,
      fullName: 'Тестовый Пользователь',
      phone: '8(900)123-45-67',
      email: 'test@example.com',
      role: UserRole.USER,
    },
  });

  console.log('Тестовый пользователь создан:', {
    login: testUser.login,
    email: testUser.email,
    role: testUser.role,
  });

  // Создаем тестовые отзывы
  const reviews = [
    {
      text: 'Отличный курс! Получил много практических навыков и уверенность в своих силах. Преподаватель очень доступно объясняет сложные темы.',
      rating: 5,
      userId: testUser.id,
    },
    {
      text: 'Курс превзошел все мои ожидания. Материал структурирован, много практики. Рекомендую всем начинающим!',
      rating: 5,
      userId: testUser.id,
    },
    {
      text: 'Очень понравилась подача материала и практические задания. Спасибо за качественное обучение!',
      rating: 4,
      userId: testUser.id,
    },
    {
      text: 'Хороший курс для начинающих. Преподаватель всегда на связи, отвечает на все вопросы.',
      rating: 5,
      userId: testUser.id,
    },
    {
      text: 'Отличная программа обучения. Получил сертификат и сразу нашел работу по специальности!',
      rating: 5,
      userId: testUser.id,
    },
    {
      text: 'Курс очень информативный, много нового узнал. Буду рекомендовать друзьям.',
      rating: 4,
      userId: testUser.id,
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({
      data: review,
    });
  }

  console.log('Создано отзывов:', reviews.length);
}

main()
  .catch((e) => {
    console.error('Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

