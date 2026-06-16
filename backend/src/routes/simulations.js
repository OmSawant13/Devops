// Simulation routes — drug discovery workflow

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');
const { simulationCounter } = require('../config/metrics');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/simulations
router.get('/', async (req, res) => {
  try {
    const simulations = await prisma.simulation.findMany({
      include: {
        genome: { select: { name: true, species: true } },
        requestedBy: { select: { fullName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(simulations);
  } catch (err) {
    logger.error('List simulations failed', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch simulations' });
  }
});

// GET /api/simulations/:id
router.get('/:id', async (req, res) => {
  try {
    const sim = await prisma.simulation.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { genome: true, requestedBy: true }
    });
    if (!sim) return res.status(404).json({ error: 'Simulation not found' });
    res.json(sim);
  } catch (err) {
    logger.error('Get simulation failed', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch simulation' });
  }
});

// POST /api/simulations - start a new drug discovery simulation
router.post('/', async (req, res) => {
  try {
    const { genomeId, drugCompound, iterations } = req.body;
    if (!genomeId || !drugCompound) {
      return res.status(400).json({ error: 'genomeId and drugCompound required' });
    }

    const genome = await prisma.genome.findUnique({ where: { id: parseInt(genomeId) } });
    if (!genome) return res.status(404).json({ error: 'Genome not found' });

    const simulation = await prisma.simulation.create({
      data: {
        genomeId: parseInt(genomeId),
        requestedById: req.user.id,
        drugCompound,
        iterations: parseInt(iterations) || 1000,
        status: 'PENDING'
      }
    });

    simulationCounter.inc({ status: 'started' });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE',
        resource: 'SIMULATION',
        details: `Started simulation: ${drugCompound} on genome ${genome.name}`,
        ipAddress: req.ip
      }
    });

    logger.info('Simulation started', {
      simulationId: simulation.id,
      genomeId,
      drugCompound,
      userId: req.user.id
    });

    // Simulate async processing (mock)
    setTimeout(async () => {
      try {
        await prisma.simulation.update({
          where: { id: simulation.id },
          data: {
            status: 'COMPLETED',
            startedAt: new Date(),
            completedAt: new Date(),
            result: `Binding affinity: -${(6 + Math.random() * 4).toFixed(2)} kcal/mol. ${
              Math.random() > 0.5 ? 'High therapeutic potential.' : 'Moderate binding observed.'
            }`
          }
        });
        simulationCounter.inc({ status: 'completed' });
        logger.info('Simulation completed', { simulationId: simulation.id });
      } catch (e) {
        logger.error('Simulation processing failed', { error: e.message });
      }
    }, 5000);

    res.status(201).json(simulation);
  } catch (err) {
    logger.error('Create simulation failed', { error: err.message });
    res.status(500).json({ error: 'Failed to create simulation' });
  }
});

module.exports = router;
