import { Router } from 'express';
import { dbService } from '../services/dbService.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
// GET /api/travel — Retrieve travel plans for logged-in user
router.get('/', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const plans = await dbService.getTravelPlans(userId);
        return res.json({ travelPlans: plans });
    }
    catch (error) {
        console.error('[travelRouter] Get Plans Error:', error);
        return res.status(500).json({ error: 'Failed to retrieve travel plans' });
    }
});
// POST /api/travel — Create a new travel plan
router.post('/', requireAuth, async (req, res) => {
    const { destination, startDate, endDate, itinerary, packingList } = req.body;
    if (!destination) {
        return res.status(400).json({ error: 'Destination is required' });
    }
    try {
        const userId = req.user.id;
        // Provide sensible senior-friendly defaults if not specified
        const finalStartDate = startDate || new Date().toISOString().split('T')[0];
        const finalEndDate = endDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
        const finalItinerary = itinerary && Array.isArray(itinerary) ? itinerary : [
            { day: 1, activities: ['Arrive at your destination', 'Check-in to lodging', 'Relaxing dinner'] }
        ];
        const finalPackingList = packingList && Array.isArray(packingList) ? packingList : [
            { id: 'p1', item: 'Walking shoes', checked: false },
            { id: 'p2', item: 'Daily Medications', checked: true },
            { id: 'p3', item: 'Phone charger', checked: false }
        ];
        const newPlan = await dbService.saveTravelPlan({
            id: 'travel-' + Math.random().toString(36).substr(2, 9),
            userId,
            destination,
            startDate: finalStartDate,
            endDate: finalEndDate,
            itinerary: finalItinerary,
            packingList: finalPackingList,
            createdAt: new Date().toISOString()
        });
        return res.status(201).json(newPlan);
    }
    catch (error) {
        console.error('[travelRouter] Save Plan Error:', error);
        return res.status(500).json({ error: 'Failed to create travel plan' });
    }
});
// PUT /api/travel/:id — Update a travel plan (including nested itinerary and packing list)
router.put('/:id', requireAuth, async (req, res) => {
    const planId = req.params.id;
    const { destination, startDate, endDate, itinerary, packingList } = req.body;
    try {
        const userId = req.user.id;
        const updated = await dbService.updateTravelPlan(planId, userId, {
            ...(destination && { destination }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            ...(itinerary && { itinerary }),
            ...(packingList && { packingList })
        });
        if (!updated) {
            return res.status(404).json({ error: 'Travel plan not found' });
        }
        return res.json(updated);
    }
    catch (error) {
        console.error('[travelRouter] Update Plan Error:', error);
        return res.status(500).json({ error: 'Failed to update travel plan' });
    }
});
// DELETE /api/travel/:id — Delete a travel plan
router.delete('/:id', requireAuth, async (req, res) => {
    const planId = req.params.id;
    try {
        const userId = req.user.id;
        const success = await dbService.deleteTravelPlan(planId, userId);
        if (!success) {
            return res.status(404).json({ error: 'Travel plan not found' });
        }
        return res.json({ success: true, message: 'Travel plan successfully deleted' });
    }
    catch (error) {
        console.error('[travelRouter] Delete Plan Error:', error);
        return res.status(500).json({ error: 'Failed to delete travel plan' });
    }
});
export default router;
//# sourceMappingURL=travel.js.map