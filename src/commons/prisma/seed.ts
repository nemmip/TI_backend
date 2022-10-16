import { PrismaClient } from '@prisma/client';
import { USER_TYPE } from '../enums/user.enums';
import { createHash } from 'crypto';
const prisma = new PrismaClient();

async function main() {
  const adminPass = createHash(process.env.HASHING_ALG)
    .update('SomeTestPass1#')
    .digest('base64');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin',
      type: USER_TYPE.ADMIN,
      password: adminPass,
    },
  });

  console.log(admin);
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
