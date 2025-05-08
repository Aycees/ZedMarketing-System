import * as bcrypt from 'bcrypt';
import { PrismaService } from '../src/prisma/prisma.service';

const prisma = new PrismaService();

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);
  const jobCategory = await prisma.jobCategory.create({
    data: {
      name: 'Routing',
      description: 'Assigned for Routing',
      isArchived: false,
    },
  });
  const job = await prisma.job.create({
    data: {
      title: 'Driver',
      description: 'Driver for Routing',
      isArchived: false,
    },
  });
  const employee = await prisma.employee.create({
    data: {
      firstname: 'John',
      middlename: 'M.',
      lastname: 'Doe',
      address: 'Davao City',
      contactNumber: '09123456789',
      employeeType: 'FULL_TIME',
      employeeStatus: 'ACTIVE', 
      account: {
        create: {
          username: 'username',
          password: hashedPassword,
          isArchived: false,
        },
      },
    }
  });
  console.log(employee);
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
