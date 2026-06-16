// Seed data for GenomeX

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding GenomeX database...');

  const passwordHash = await bcrypt.hash('Password@123', 10);

  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@genomex.io' },
    update: {},
    create: {
      email: 'admin@genomex.io',
      passwordHash,
      fullName: 'Dr. Sarah Chen',
      role: 'ADMIN',
      organization: 'GenomeX Bioinformatics'
    }
  });

  const scientist = await prisma.user.upsert({
    where: { email: 'scientist@genomex.io' },
    update: {},
    create: {
      email: 'scientist@genomex.io',
      passwordHash,
      fullName: 'Dr. Raj Patel',
      role: 'SCIENTIST',
      organization: 'IIT Bombay'
    }
  });

  const researcher = await prisma.user.upsert({
    where: { email: 'researcher@genomex.io' },
    update: {},
    create: {
      email: 'researcher@genomex.io',
      passwordHash,
      fullName: 'Anita Sharma',
      role: 'RESEARCHER',
      organization: 'Pfizer India'
    }
  });

  console.log('✅ 3 users created');

  // Genomes
  const genome1 = await prisma.genome.create({
    data: {
      name: 'BRCA1 Mutation Sample',
      species: 'Homo sapiens',
      sequence: 'ATCGATCGATCGTAGCTAGCTAGCATCGATCG...',
      description: 'Breast cancer related gene sequence',
      uploadedById: scientist.id
    }
  });

  const genome2 = await prisma.genome.create({
    data: {
      name: 'TP53 Tumor Suppressor',
      species: 'Homo sapiens',
      sequence: 'GCATGCATGCATATCGTAGCTAGCATATAT...',
      description: 'Critical tumor suppressor gene',
      uploadedById: scientist.id
    }
  });

  const genome3 = await prisma.genome.create({
    data: {
      name: 'SARS-CoV-2 Spike Protein',
      species: 'Coronavirus',
      sequence: 'ATGTTTGTTTTTCTTGTTTTATTGCCACTAGT...',
      description: 'Viral spike protein for vaccine research',
      uploadedById: admin.id
    }
  });

  console.log('✅ 3 genomes created');

  // Simulations
  await prisma.simulation.create({
    data: {
      genomeId: genome1.id,
      requestedById: researcher.id,
      drugCompound: 'Olaparib',
      iterations: 5000,
      status: 'COMPLETED',
      result: 'Binding affinity: -8.2 kcal/mol. High therapeutic potential detected.',
      startedAt: new Date(Date.now() - 3600000),
      completedAt: new Date()
    }
  });

  await prisma.simulation.create({
    data: {
      genomeId: genome2.id,
      requestedById: researcher.id,
      drugCompound: 'Cisplatin',
      iterations: 3000,
      status: 'RUNNING',
      startedAt: new Date()
    }
  });

  await prisma.simulation.create({
    data: {
      genomeId: genome3.id,
      requestedById: scientist.id,
      drugCompound: 'Remdesivir',
      iterations: 10000,
      status: 'PENDING'
    }
  });

  console.log('✅ 3 simulations created');

  // Audit logs
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'CREATE',
      resource: 'GENOME',
      details: 'Uploaded SARS-CoV-2 Spike Protein sequence',
      ipAddress: '10.0.1.5'
    }
  });

  console.log('✅ Audit logs seeded');

  console.log('\n🎉 Seeding complete!\n');
  console.log('📝 Login credentials:');
  console.log('   admin@genomex.io      / Password@123 (ADMIN)');
  console.log('   scientist@genomex.io  / Password@123 (SCIENTIST)');
  console.log('   researcher@genomex.io / Password@123 (RESEARCHER)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
