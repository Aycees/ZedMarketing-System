import * as bcrypt from 'bcrypt';
import { PrismaService } from '../src/prisma/prisma.service';

const prisma = new PrismaService();

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);
  const seedAccount = await prisma.account.upsert({
    where: { username: 'testUsername' },
    update: {},
    create: {
      username: 'username',
      password: hashedPassword,
      isArchived: false,
    },
  });
  console.log(seedAccount);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
