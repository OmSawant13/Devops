// Genome routes

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, requireRole } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/genomes
router.get('/', async (req, res) => {
  try {
    const genomes = await prisma.genome.findMany({
      include: {
        uploadedBy: { select: { fullName: true, email: true } },
        _count: { select: { simulations: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(genomes);
  } catch (err) {
    logger.error('List genomes failed', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch genomes' });
  }
});

// GET /api/genomes/:id
router.get('/:id', async (req, res) => {
  try {
    const genome = await prisma.genome.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        uploadedBy: { select: { fullName: true, email: true } },
        simulations: { orderBy: { createdAt: 'desc' } }
      }
    });
    if (!genome) return res.status(404).json({ error: 'Genome not found' });
    res.json(genome);
  } catch (err) {
    logger.error('Get genome failed', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch genome' });
  }
});

// POST /api/genomes
router.post('/', requireRole('ADMIN', 'SCIENTIST'), async (req, res) => {
  try {
    const { name, species, sequence, description } = req.body;
    if (!name || !species || !sequence) {
      return res.status(400).json({ error: 'name, species, sequence required' });
    }

    const genome = await prisma.genome.create({
      data: { name, species, sequence, description, uploadedById: req.user.id }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE',
        resource: 'GENOME',
        details: `Uploaded: ${name}`,
        ipAddress: req.ip
      }
    });

    logger.info('Genome created', { genomeId: genome.id, userId: req.user.id });
    res.status(201).json(genome);
  } catch (err) {
    logger.error('Create genome failed', { error: err.message });
    res.status(500).json({ error: 'Failed to create genome' });
  }
});

// DELETE /api/genomes/:id
router.delete('/:id', requireRole('ADMIN'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.simulation.deleteMany({ where: { genomeId: id } });
    await prisma.genome.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'DELETE',
        resource: 'GENOME',
        details: `Genome ID: ${id}`,
        ipAddress: req.ip
      }
    });

    logger.info('Genome deleted', { genomeId: id, userId: req.user.id });
    res.json({ message: 'Genome deleted' });
  } catch (err) {
    logger.error('Delete genome failed', { error: err.message });
    res.status(500).json({ error: 'Failed to delete genome' });
  }
});

module.exports = router;
