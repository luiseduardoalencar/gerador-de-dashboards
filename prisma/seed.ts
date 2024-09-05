import { prisma } from '../src/prisma';

async function main() {
  await prisma.expression.createMany({
    data: [
      { name: 'Sum', formula: 'SUM(value)' },
      { name: 'Average', formula: 'AVG(value)' },
      { name: 'Count', formula: 'COUNT(value)' },
      { name: 'Maximum', formula: 'MAX(value)' },
      { name: 'Minimum', formula: 'MIN(value)' }
    ],
  });

  console.log('Expressions have been seeded successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
