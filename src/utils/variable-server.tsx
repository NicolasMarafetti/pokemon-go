import prisma from '@/lib/prisma';

export function calculateNewFinalDivider(
  attackPower: number,
  defensePower: number
) {
  const totalPower = attackPower + defensePower;

  return Number((totalPower / 100 - 0.01).toFixed(2));
}

export async function getCombatDuration() {
  const variable = await prisma.variable.findUnique({
    where: {
      name: 'combat_duration',
    },
  });

  return variable!.value;
}

export async function getFinalCalculationDivider() {
  const variable = await prisma.variable.findUnique({
    where: {
      name: 'final_calculation_divider',
    },
  });

  return variable!.value;
}

export async function updateDivider(newDivider: number) {
  await prisma.variable.update({
    data: {
      value: newDivider,
    },
    where: {
      name: 'final_calculation_divider',
    },
  });
}
