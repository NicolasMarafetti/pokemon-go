import { PrismaClient } from '@prisma/client';

import createVariables from './seed/variables';

const prisma = new PrismaClient();

async function main() {
  createVariables();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
