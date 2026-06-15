import { Router } from 'express';
import { dbService } from '../services/dbService.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/medications — Retrieve all medications for the logged-in user
router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const meds = await dbService.getMedications(userId);
    return res.json({ medications: meds });
  } catch (error) {
    console.error('[medsRouter] Get Meds Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve medications' });
  }
});

// POST /api/medications — Add a new medication
router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { name, dosage, schedule, time } = req.body;
  if (!name || !dosage) {
    return res.status(400).json({ error: 'Medication name and dosage are required' });
  }

  // Support single "time" parameter or full "schedule" array
  const finalSchedule = schedule && Array.isArray(schedule) 
    ? schedule 
    : (time ? [time] : ['08:00']);

  try {
    const userId = req.user!.id;
    const newMed = await dbService.saveMedication({
      id: 'med-' + Math.random().toString(36).substr(2, 9),
      userId,
      name,
      dosage,
      schedule: finalSchedule,
      takenToday: [],
      createdAt: new Date().toISOString()
    });

    return res.status(201).json(newMed);
  } catch (error) {
    console.error('[medsRouter] Save Med Error:', error);
    return res.status(500).json({ error: 'Failed to record medication' });
  }
});

// PUT /api/medications/:id — Update medication details
router.put('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { name, dosage, schedule, takenToday } = req.body;
  const medId = req.params.id as string;

  try {
    const userId = req.user!.id;
    const updated = await dbService.updateMedication(medId, userId, {
      ...(name && { name }),
      ...(dosage && { dosage }),
      ...(schedule && { schedule }),
      ...(takenToday && { takenToday })
    });

    if (!updated) {
      return res.status(404).json({ error: 'Medication not found' });
    }

    return res.json(updated);
  } catch (error) {
    console.error('[medsRouter] Update Med Error:', error);
    return res.status(500).json({ error: 'Failed to update medication details' });
  }
});

// DELETE /api/medications/:id — Remove medication
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const medId = req.params.id as string;

  try {
    const userId = req.user!.id;
    const success = await dbService.deleteMedication(medId, userId);
    if (!success) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    return res.json({ success: true, message: 'Medication successfully removed' });
  } catch (error) {
    console.error('[medsRouter] Delete Med Error:', error);
    return res.status(500).json({ error: 'Failed to delete medication' });
  }
});

// POST /api/medications/:id/take — Mark dose as taken today
router.post('/:id/take', requireAuth, async (req: AuthenticatedRequest, res) => {
  const medId = req.params.id as string;
  const { time } = req.body;

  if (!time) {
    return res.status(400).json({ error: 'Time of dose (e.g. "08:00") is required' });
  }

  try {
    const userId = req.user!.id;
    const meds = await dbService.getMedications(userId);
    const med = meds.find(m => m.id === medId);

    if (!med) {
      return res.status(404).json({ error: 'Medication not found' });
    }

    // Toggle logic for takenToday: if already taken, untake it. Otherwise, add it.
    let updatedTakenToday = [...med.takenToday];
    if (updatedTakenToday.includes(time)) {
      updatedTakenToday = updatedTakenToday.filter(t => t !== time);
    } else {
      updatedTakenToday.push(time);
    }

    const updated = await dbService.updateMedication(medId, userId, {
      takenToday: updatedTakenToday
    });

    return res.json(updated);
  } catch (error) {
    console.error('[medsRouter] Take Med Error:', error);
    return res.status(500).json({ error: 'Failed to record medication dose' });
  }
});

export default router;
