import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function createVariables() {
  await prisma.variable.createMany({
    data: [
      {
        name: 'combat_duration',
        value: 3,
      },
      {
        name: 'final_calculation_divider',
        value: 600,
      },
    ],
  });
}
