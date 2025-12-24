import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
const courses = [
    {
      name: 'Основы программирования на Python',
      teacher: 'Иванов Иван Иванович',
      description: 'Изучите основы Python: синтаксис, структуры данных, ООП и многое другое',
      image: 'https://example.com/python.jpg',
    },
    {
      name: 'Web-разработка на JavaScript',
      teacher: 'Петрова Мария Сергеевна',
      description: 'Создание современных веб-приложений с использованием JavaScript, React и Node.js',
      image: 'https://example.com/javascript.jpg',
    },
    {
      name: 'Машинное обучение и AI',
      teacher: 'Смирнов Алексей Петрович',
      description: 'Введение в машинное обучение, нейронные сети и искусственный интеллект',
      image: 'https://example.com/ml.jpg',
    },
    {
      name: 'DevOps и облачные технологии',
      teacher: 'Козлова Елена Дмитриевна',
      description: 'Docker, Kubernetes, CI/CD и работа с облачными платформами',
      image: 'https://example.com/devops.jpg',
    },
    {
      name: 'Базы данных и SQL',
      teacher: 'Новиков Дмитрий Александрович',
      description: 'Проектирование баз данных, SQL запросы, оптимизация и администрирование',
      image: 'https://example.com/sql.jpg',
    },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { name: course.name },
      update: {},
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
}

main()
  .catch((e) => {
    console.error('Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

